import type { APIRoute } from 'astro';

export const prerender = false;

type Body = {
  lang?: 'es' | 'en';
  mainKeyword?: string;
  relatedKeywords?: string[];
  competitorData?: string;
  turnstileToken?: string;
};

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

function getClientIp(request: Request) {
  const xff = request.headers.get('x-forwarded-for');
  if (!xff) return '';
  return xff.split(',')[0]?.trim() ?? '';
}

async function verifyTurnstile(opts: { token: string; ip?: string }) {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('[generar-estructura-articulo] Missing TURNSTILE_SECRET_KEY');
    return { ok: false as const, error: 'TURNSTILE_SECRET_KEY not configured' };
  }

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', opts.token);
  if (opts.ip) form.set('remoteip', opts.ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  const data = (await res.json().catch(() => null)) as TurnstileVerifyResponse | null;
  if (!res.ok || !data) {
    return { ok: false as const, error: 'Turnstile verification failed' };
  }

  if (!data.success) {
    const codes = Array.isArray(data['error-codes']) ? data['error-codes'].join(', ') : '';
    return { ok: false as const, error: codes ? `Turnstile rejected: ${codes}` : 'Turnstile rejected' };
  }

  return { ok: true as const };
}

function buildPrompt(opts: { lang: 'es' | 'en'; mainKeyword: string; relatedKeywords: string[]; competitorData: string }) {
  const { lang, mainKeyword, relatedKeywords, competitorData } = opts;

  const template = lang === 'es'
    ? `Eres un experto en SEO y en la creación de esquemas de contenido optimizados para Google. Tu tarea es generar una ESTRUCTURA DE ARTÍCULO COMPLETA que supere a la competencia en los resultados de búsqueda.

**PALABRA CLAVE PRINCIPAL:** {MAIN_KEYWORD}
**PALABRAS CLAVE RELACIONADAS:** {RELATED_KEYWORDS}

**ANÁLISIS DE LA COMPETENCIA:**

{COMPETITOR_DATA}

**INSTRUCCIONES IMPORTANTES:**

1. **ANÁLISIS SEMÁNTICO Y BÚSQUEDA DE INTENCIÓN:**

- Identifica la intención de búsqueda del usuario (informativa, transaccional, de navegación, comercial).

- Cubre TODAS las posibles variaciones de intención con tus subsecciones. Añade secciones opcionales como listas, tipos, tablas, ejemplos, errores comunes y estrategia (no es obligatorio, pero inclúyelas si es necesario). Añade también una sección de "Otras preguntas de los usuarios".

- Responde completamente a la pregunta principal y a las preguntas secundarias.

- Utiliza el análisis semántico: sinónimos, términos relacionados y variaciones naturales.

**GENERA LA ESTRUCTURA COMPLETA AHORA:**`
    : `You are an expert in SEO and creating content outlines optimized for Google. Your task is to generate a COMPLETE article STRUCTURE that outperforms the competition in search results.

**MAIN KEYWORD:** {MAIN_KEYWORD}
**RELATED KEYWORDS:** {RELATED_KEYWORDS}

**COMPETITIVE ANALYSIS:**

{COMPETITOR_DATA}

**CRITICAL INSTRUCTIONS:**

1. **SEMANTIC ANALYSIS AND SEARCH INTENT:**

- Identify the user's search intent (informational, transactional, navigational, commercial)

- Cover ALL possible intent variations with your subsections. Add optional sections such as lists, types, tables, examples, common mistakes, and strategy (not mandatory, but include if needed). Also add a People Also Ask section.

- Fully answer the main question and secondary questions.

- Use semantic analysis: synonyms, related terms, and natural variations.

**GENERATE THE COMPLETE STRUCTURE NOW:**`;

  return template
    .replaceAll('{MAIN_KEYWORD}', mainKeyword)
    .replaceAll('{RELATED_KEYWORDS}', relatedKeywords.join(', '))
    .replaceAll('{COMPETITOR_DATA}', competitorData || (lang === 'es' ? 'N/A' : 'N/A'));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;

    const lang: 'es' | 'en' = body?.lang === 'en' ? 'en' : 'es';
    const mainKeyword = typeof body?.mainKeyword === 'string' ? body.mainKeyword.trim() : '';
    const relatedKeywords = Array.isArray(body?.relatedKeywords)
      ? body.relatedKeywords.filter((k): k is string => typeof k === 'string').map((k) => k.trim()).filter(Boolean)
      : [];

    const competitorData = typeof body?.competitorData === 'string' ? body.competitorData.trim() : '';
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken.trim() : '';

    if (!mainKeyword) {
      return new Response(JSON.stringify({ error: 'Missing mainKeyword' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!import.meta.env.DEV) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: 'Missing captcha token' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const verify = await verifyTurnstile({ token: turnstileToken, ip: getClientIp(request) });
      if (!verify.ok) {
        return new Response(JSON.stringify({ error: 'Captcha verification failed', details: verify.error }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[generar-estructura-articulo] Missing GEMINI_API_KEY');
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt({ lang, mainKeyword, relatedKeywords, competitorData });

    const systemInstruction =
      lang === 'es'
        ? 'Eres un experto en SEO y creación de contenido optimizado. Generas estructuras de artículos que superan a la competencia en Google.'
        : 'You are an SEO and content strategy expert. You generate article outlines that outperform competitors on Google.';

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3500,
          },
        }),
      }
    );

    const rawText = await res.text();
    const data = (() => {
      try {
        return rawText ? JSON.parse(rawText) : null;
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      console.error('[generar-estructura-articulo] Gemini API error', {
        status: res.status,
        details: data || rawText,
      });
      return new Response(
        JSON.stringify({
          error: 'Gemini API error',
          details: data || rawText || `HTTP ${res.status}`,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const outline = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n');
    if (typeof outline !== 'string' || !outline.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid response from Gemini' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ outline }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[generar-estructura-articulo] Internal error', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
