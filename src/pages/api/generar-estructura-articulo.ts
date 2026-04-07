import type { APIRoute } from 'astro';

export const prerender = false;

type Body = {
  lang?: 'es' | 'en';
  mainKeyword?: string;
  relatedKeywords?: string[];
  competitorData?: string;
};

const API_URL = 'https://api.x.ai/v1/chat/completions';
const MODEL = 'grok-4-1-fast-reasoning';

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

    if (!mainKeyword) {
      return new Response(JSON.stringify({ error: 'Missing mainKeyword' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.GROK_API_KEY;
    if (!apiKey) {
      console.error('[generar-estructura-articulo] Missing GROK_API_KEY');
      return new Response(JSON.stringify({ error: 'GROK_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt({ lang, mainKeyword, relatedKeywords, competitorData });

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              lang === 'es'
                ? 'Eres un experto en SEO y creación de contenido optimizado. Generas estructuras de artículos que superan a la competencia en Google.'
                : 'You are an SEO and content strategy expert. You generate article outlines that outperform competitors on Google.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3500,
      }),
    });

    const rawText = await res.text();
    const data = (() => {
      try {
        return rawText ? JSON.parse(rawText) : null;
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      console.error('[generar-estructura-articulo] xAI API error', {
        status: res.status,
        details: data || rawText,
      });
      return new Response(JSON.stringify({
        error: 'xAI API error',
        details: data || rawText || `HTTP ${res.status}`,
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const outline = data?.choices?.[0]?.message?.content;
    if (typeof outline !== 'string' || !outline.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid response from xAI' }), {
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
