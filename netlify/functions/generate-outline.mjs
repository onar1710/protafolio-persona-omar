const PROMPT_EN = `You are an expert in SEO and creating content outlines optimized for Google. Your task is to generate a COMPLETE article STRUCTURE that outperforms the competition in search results.

**MAIN KEYWORD:** {MAIN_KEYWORD}
**RELATED KEYWORDS:** {RELATED_KEYWORDS}

**COMPETITIVE ANALYSIS:**

{COMPETITOR_DATA}

**CRITICAL INSTRUCTIONS:**

1. **SEMANTIC ANALYSIS AND INTENTION SEARCH:**

- Identify the user's search intent (informational, transactional, navigational, commercial)
- Cover ALL possible intent variations with your subsections. Add optional sections such as lists, types, tables, examples, common mistakes, and strategy (not mandatory, but include if needed). Also add a People Also Ask section.
- Fully answer the main question and secondary questions.
- Use semantic analysis: synonyms, related terms, and natural variations.

**GENERATE THE COMPLETE STRUCTURE NOW.**`;

const PROMPT_ES = `Eres un experto en SEO y en crear esquemas de contenido optimizados para Google. Tu tarea es generar una ESTRUCTURA COMPLETA de artículo que supere a la competencia en resultados de búsqueda.

**PALABRA CLAVE PRINCIPAL:** {MAIN_KEYWORD}
**PALABRAS CLAVE RELACIONADAS:** {RELATED_KEYWORDS}

**ANÁLISIS COMPETITIVO:**

{COMPETITOR_DATA}

**INSTRUCCIONES CRÍTICAS:**

1. **ANÁLISIS SEMÁNTICO E INTENCIÓN DE BÚSQUEDA:**

- Identifica la intención de búsqueda del usuario (informativa, transaccional, navegacional, comercial)
- Cubre TODAS las variaciones de intención con subsecciones. Agrega secciones opcionales como listas, tipos, tablas, ejemplos, errores comunes y estrategia (no obligatorio, pero inclúyelo si hace falta). Incluye también una sección People Also Ask.
- Responde completamente la pregunta principal y las secundarias.
- Usa análisis semántico: sinónimos, términos relacionados y variaciones naturales.

**GENERA LA ESTRUCTURA COMPLETA AHORA.**`;

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

function normalize(value) {
  return String(value || '').trim();
}

function toKeywordList(value) {
  if (Array.isArray(value)) return value.map((v) => normalize(v)).filter(Boolean);
  return normalize(value)
    .split(',')
    .map((v) => normalize(v))
    .filter(Boolean);
}

function extractCompetitorDataFromJson(jsonData) {
  const competitorInfo = [];

  if (jsonData && Array.isArray(jsonData.articles)) {
    competitorInfo.push('COMPETITOR ARTICLES:');
    jsonData.articles.forEach((article, idx) => {
      competitorInfo.push(`\n--- Article ${idx + 1} ---`);
      competitorInfo.push(`Title: ${article?.title ?? 'N/A'}`);
      competitorInfo.push(`Description: ${article?.description ?? 'N/A'}`);
      const content = article?.content ?? '';
      if (content) competitorInfo.push(`Content: ${String(content).slice(0, 1200)}...`);
    });
  }

  if (jsonData && Array.isArray(jsonData.organicResults)) {
    competitorInfo.push('\n\nGOOGLE ORGANIC RESULTS:');
    jsonData.organicResults.forEach((result) => {
      competitorInfo.push(`\n--- Position ${result?.position ?? 'N/A'} ---`);
      competitorInfo.push(`Title: ${result?.title ?? 'N/A'}`);
      competitorInfo.push(`Snippet: ${result?.snippet ?? 'N/A'}`);
    });
  }

  if (jsonData && Array.isArray(jsonData.peopleAlsoAsk)) {
    competitorInfo.push('\n\nPEOPLE ALSO ASK:');
    jsonData.peopleAlsoAsk.forEach((q, idx) => {
      if (q && typeof q === 'object') {
        competitorInfo.push(`${idx + 1}. ${q.question ?? 'N/A'}`);
        if (q.answer) competitorInfo.push(`   Answer: ${String(q.answer).slice(0, 400)}...`);
      } else {
        competitorInfo.push(`${idx + 1}. ${String(q)}`);
      }
    });
  }

  return competitorInfo.join('\n').trim();
}

async function callGrok({ apiKey, promptText }) {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-4-1-fast-reasoning',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in SEO and content structure. Return only the outline/structure in markdown.',
        },
        { role: 'user', content: promptText },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Grok request failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content || '').trim();
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
  const mainKeyword = normalize(payload.main_keyword || payload.mainKeyword);
  const relatedKeywords = toKeywordList(payload.related_keywords || payload.relatedKeywords);
  const competitorJsonText = normalize(payload.competitor_json || payload.competitorJson);

  if (!mainKeyword) {
    return json(400, { error: 'main_keyword is required' });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return json(501, { error: 'GROK_API_KEY is not configured on the server' });
  }

  let competitorData = '';
  if (competitorJsonText) {
    try {
      const parsed = JSON.parse(competitorJsonText);
      competitorData = extractCompetitorDataFromJson(parsed);
    } catch {
      competitorData = competitorJsonText;
    }
  }

  const promptTemplate = language === 'es' ? PROMPT_ES : PROMPT_EN;
  const promptText = promptTemplate
    .replaceAll('{MAIN_KEYWORD}', mainKeyword)
    .replaceAll('{RELATED_KEYWORDS}', relatedKeywords.join(', '))
    .replaceAll('{COMPETITOR_DATA}', competitorData || (language === 'es' ? 'Sin datos de competencia.' : 'No competitor data provided.'));

  try {
    const outline = await callGrok({ apiKey, promptText });
    return json(200, { outline });
  } catch (e) {
    return json(500, { error: 'Failed to generate outline', detail: String(e?.message || e) });
  }
}

