import type { APIRoute } from 'astro';

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

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
    attempts.push({ index: i, status: res.status, body: body.slice(0, 500) });

    if (res.status === 429 || res.status === 503) {
      continue;
    }

    return { ok: false as const, res, keyIndex: i, attempts, body };
  }

  const body = lastRes ? await lastRes.text().catch(() => '') : '';
  return { ok: false as const, res: lastRes, keyIndex: -1, attempts, body };
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const keys = getGeminiApiKeys();
    if (!keys.length) {
      return new Response(JSON.stringify({ error: 'No GEMINI keys configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    const force429 = url.searchParams.get('force429') === '1';

    const payload = {
      systemInstruction: {
        parts: [{ text: 'You respond with exactly one short line.' }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: force429
                ? 'Reply with one line. (test)'
                : 'Reply with one line: OK',
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 50,
      },
    };

    const rotated = await fetchGeminiWithRotation({ payload, keys });
    if (!rotated.ok) {
      const status = rotated.res?.status || 502;
      return new Response(
        JSON.stringify({
          ok: false,
          status,
          usedKeyIndex: rotated.keyIndex,
          attempts: rotated.attempts,
          details: rotated.body?.slice(0, 1000) || '',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const text = await rotated.res.text();
    return new Response(
      JSON.stringify({
        ok: true,
        usedKeyIndex: rotated.keyIndex,
        attempts: rotated.attempts,
        responsePreview: text.slice(0, 300),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
