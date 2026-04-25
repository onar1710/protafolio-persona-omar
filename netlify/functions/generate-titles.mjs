const PROMPT_EN = `Act like an SEO and content marketing expert.

Generate 10 engaging, SEO-optimized titles for blog posts about web design and development, SEO, and digital marketing, maintaining the exact keyword.

Important rules:
- The user will provide a "Tone". You MUST write the titles in that tone.

- They should NOT be used to describe the content.

- You can add interrogative pronouns or adverbials.

Generate engaging, SEO-optimized titles for blog posts about web design and development, SEO, and digital marketing.

Important rules:
- They should NOT offer services or sell web design.

- They should be written for a blog post that explains and teaches.

- Include the keyword or a natural variation in the title.

Titles should:
- Be designed to attract potential clients who need a website or SEO services.

- Be clear, catchy, and easy to understand.

- Ideally, be between 50 and 80 characters.

- Include keywords related to web design, web development, or SEO.

- Be optimized for Google ranking.

Returns only a numbered list of titles.

FORBIDDEN PHRASES (never use these):
❌ "Complete Guide" / "Guía Completa"
❌ "Discover" / "Descubre"  
❌ "Ultimate" / "Definitiva"
❌ "Step by Step" / "Paso a Paso"
❌ "Tips and Tricks" / "Trucos y Consejos"
❌ "Everything You Need"
❌ "Best Practices" / "Mejores Prácticas"

OUTPUT (10 lines, nothing else):
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]
[One complete sentence]`;

const PROMPT_ES = `Actúa como un experto en SEO y marketing de contenidos.

Genera 10 títulos atractivos y optimizados para SEO para artículos de blog sobre diseño web, desarrollo web, SEO y marketing digital, manteniendo la palabra clave exacta.

Reglas importantes:
- El usuario te dará un "Tono". DEBES escribir los títulos con ese tono.

- NO deben describir el contenido.

- Puedes usar pronombres/adverbios interrogativos.

Reglas adicionales:
- NO deben ofrecer servicios ni vender diseño web.
- Deben estar escritos para un artículo que explica y enseña.
- Incluye la palabra clave o una variación natural en el título.

Los títulos deben:
- Atraer a potenciales clientes que necesitan una web o servicios SEO.
- Ser claros, llamativos y fáciles de entender.
- Idealmente, entre 50 y 80 caracteres.
- Incluir términos relacionados con diseño web, desarrollo web o SEO.
- Estar optimizados para posicionar en Google.

Devuelve solo una lista numerada de títulos.

FRASES PROHIBIDAS (nunca uses estas):
❌ "Guía Completa" / "Complete Guide"
❌ "Descubre" / "Discover"
❌ "Definitiva" / "Ultimate"
❌ "Paso a Paso" / "Step by Step"
❌ "Trucos y Consejos" / "Tips and Tricks"
❌ "Todo lo que necesitas" / "Everything You Need"
❌ "Mejores Prácticas" / "Best Practices"

SALIDA (10 líneas, nada más):
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]
[Una frase completa]`;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function pickPrompt(language) {
  return language === 'es' ? PROMPT_ES : PROMPT_EN;
}

function normalize(value) {
  return String(value || '').trim();
}

function cleanLines(text) {
  return String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseNumberedList(text) {
  const lines = cleanLines(text);
  const items = [];
  for (const line of lines) {
    const normalized = line.replace(/^\s*\d+[\.\)\-:]\s*/, '').trim();
    if (normalized) items.push(normalized);
  }
  const uniq = [];
  for (const item of items) {
    if (!uniq.includes(item)) uniq.push(item);
  }
  return uniq.slice(0, 10);
}

async function callGemini({ apiKey, model, promptText }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).filter(Boolean).join('\n') ||
    '';

  return String(text).trim();
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const language = normalize(payload.language).toLowerCase() === 'es' ? 'es' : 'en';
  const keyword = normalize(payload.keyword);
  const topic = normalize(payload.topic);
  const tone = normalize(payload.tone) || (language === 'es' ? 'Professional' : 'Professional');

  if (!keyword || !topic) {
    return json(400, { error: 'keyword and topic are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(501, { error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const prompt = pickPrompt(language);
  const toneLabel = language === 'es' ? 'Tono' : 'Tone';
  const userInput = `Keyword: ${keyword}\nTopic: ${topic}\n${toneLabel}: ${tone}`;
  const mergedPrompt = `${prompt}\n\n${userInput}`;

  try {
    const raw = await callGemini({
      apiKey,
      model: 'gemini-2.5-flash-lite',
      promptText: mergedPrompt,
    });

    const titles = parseNumberedList(raw);
    return json(200, { titles, raw });
  } catch (e) {
    return json(500, { error: 'Failed to generate titles', detail: String(e?.message || e) });
  }
}

