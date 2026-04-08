import type { APIRoute } from 'astro';

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

type Body = {
  lang?: 'es' | 'en';
  keyword?: string;
  topic?: string;
  tone?: string;
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
  const secret = getServerEnv('TURNSTILE_SECRET_KEY');
  if (!secret) {
    console.error('[generar-titulos] Missing TURNSTILE_SECRET_KEY');
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

function loadLocalFallbackEnv() {
  try {
    const candidate = path.join(process.cwd(), 'title-generator', '.env');
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
    }
  } catch {
    // ignore
  }
}

function getServerEnv(key: string) {
  let viteValue: unknown;
  switch (key) {
    case 'GEMINI_API_KEYS':
      viteValue = import.meta.env.GEMINI_API_KEYS;
      break;
    case 'GEMINI_API_KEY':
      viteValue = import.meta.env.GEMINI_API_KEY;
      break;
    case 'GEMINI_API_KEY_2':
      viteValue = import.meta.env.GEMINI_API_KEY_2;
      break;
    case 'GEMINI_API_KEY_3':
      viteValue = import.meta.env.GEMINI_API_KEY_3;
      break;
    case 'GEMINI_API_KEY_4':
      viteValue = import.meta.env.GEMINI_API_KEY_4;
      break;
    case 'GEMINI_API_KEY_5':
      viteValue = import.meta.env.GEMINI_API_KEY_5;
      break;
    case 'GEMINI_API_KEY_6':
      viteValue = import.meta.env.GEMINI_API_KEY_6;
      break;
    case 'GEMINI_API_KEY_7':
      viteValue = import.meta.env.GEMINI_API_KEY_7;
      break;
    case 'GEMINI_API_KEY_8':
      viteValue = import.meta.env.GEMINI_API_KEY_8;
      break;
    case 'GEMINI_API_KEY_9':
      viteValue = import.meta.env.GEMINI_API_KEY_9;
      break;
    case 'GEMINI_API_KEY_10':
      viteValue = import.meta.env.GEMINI_API_KEY_10;
      break;
    case 'TURNSTILE_SECRET_KEY':
      viteValue = import.meta.env.TURNSTILE_SECRET_KEY;
      break;
    default:
      viteValue = undefined;
  }

  if (typeof viteValue === 'string' && viteValue.trim()) return viteValue;

  loadLocalFallbackEnv();
  const nodeValue = process.env[key];
  if (typeof nodeValue === 'string' && nodeValue.trim()) return nodeValue;

  return '';
}

function getGeminiApiKeys() {
  const keysRaw = getServerEnv('GEMINI_API_KEYS');
  const fromList = keysRaw
    ? keysRaw
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  const numbered: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const k = i === 1 ? getServerEnv('GEMINI_API_KEY') : getServerEnv(`GEMINI_API_KEY_${i}`);
    if (k) numbered.push(k);
  }

  const merged = [...fromList, ...numbered];
  return Array.from(new Set(merged));
}

async function fetchGeminiWithRotation(opts: { payload: unknown; keys: string[] }) {
  const attempts: Array<{ index: number; status: number; body: string }> = [];
  let lastRes: Response | null = null;

  for (let i = 0; i < opts.keys.length; i += 1) {
    const apiKey = opts.keys[i];
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opts.payload),
      }
    );

    lastRes = res;
    if (res.ok) {
      return { ok: true as const, res, keyIndex: i, attempts };
    }

    const body = await res.text();
    attempts.push({ index: i, status: res.status, body: body.slice(0, 1000) });

    if (res.status === 429 || res.status === 503) {
      continue;
    }

    return { ok: false as const, res, keyIndex: i, attempts, body };
  }

  const body = lastRes ? await lastRes.text().catch(() => '') : '';
  return { ok: false as const, res: lastRes, keyIndex: -1, attempts, body };
}

function buildPrompt(opts: { lang: 'es' | 'en'; keyword: string; topic: string; tone: string }) {
  const { lang, keyword, topic, tone } = opts;

  if (lang === 'es') {
    return `Actúa como un experto en SEO y marketing de contenidos.\n\nGenera 10 títulos atractivos y optimizados para SEO, manteniendo la palabra clave exacta o una variación natural.\n\nKeyword: ${keyword}\nTema: ${topic}\nTono: ${tone}\n\nReglas:\n- Devuelve solo una lista numerada (10 líneas).\n- No vendas servicios; es para un artículo que enseña.\n- Evita frases tipo \"Guía completa\", \"Definitiva\", \"Paso a paso\".\n`;
  }

  return `Act like an SEO and content marketing expert.\n\nGenerate 10 engaging SEO-optimized blog post titles. Keep the exact keyword or a natural variation.\n\nKeyword: ${keyword}\nTopic: ${topic}\nTone: ${tone}\n\nRules:\n- Return only a numbered list (10 lines).\n- Do not sell services; write for an educational blog post.\n- Avoid phrases like \"Complete Guide\", \"Ultimate\", \"Step by Step\".\n`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;

    const lang: 'es' | 'en' = body?.lang === 'en' ? 'en' : 'es';
    const keyword = typeof body?.keyword === 'string' ? body.keyword.trim() : '';
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    const tone = typeof body?.tone === 'string' ? body.tone.trim() : '';
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken.trim() : '';

    if (!keyword) {
      return new Response(JSON.stringify({ error: 'Missing keyword' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Missing topic' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!tone) {
      return new Response(JSON.stringify({ error: 'Missing tone' }), {
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

    const apiKeys = getGeminiApiKeys();
    if (!apiKeys.length) {
      console.error('[generar-titulos] Missing GEMINI_API_KEY');
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemInstruction =
      lang === 'es'
        ? 'Eres un experto en SEO y redacción. Generas títulos claros y persuasivos para artículos educativos.'
        : 'You are an SEO copywriting expert. You generate clear, persuasive titles for educational blog posts.';

    const prompt = buildPrompt({ lang, keyword, topic, tone });

    const payload = {
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
        temperature: 0.75,
        maxOutputTokens: 1200,
      },
    };

    const rotated = await fetchGeminiWithRotation({ payload, keys: apiKeys });
    const rawText = rotated.ok ? await rotated.res.text() : rotated.body;
    const data = (() => {
      try {
        return rawText ? JSON.parse(rawText) : null;
      } catch {
        return null;
      }
    })();

    if (!rotated.ok) {
      const status = rotated.res?.status || 502;
      console.error('[generar-titulos] Gemini API error', {
        status,
        attempts: rotated.attempts,
        details: data || rawText,
      });
      return new Response(
        JSON.stringify({
          error: 'Gemini API error',
          details: data || rawText || `HTTP ${status}`,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const titles = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n');
    if (typeof titles !== 'string' || !titles.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid response from Gemini' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ titles: titles.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[generar-titulos] Internal error', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
