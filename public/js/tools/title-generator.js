function normalizeSpaces(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function pick(en, es, lang) {
  return lang === 'en' ? en : es;
}

function withTopic(keyword, topic, lang) {
  const k = normalizeSpaces(keyword);
  const t = normalizeSpaces(topic);
  if (!t) return k;
  return lang === 'en' ? `${k} — ${t}` : `${k}: ${t}`;
}

function normalizeToneToFallbackKey(tone) {
  const v = String(tone || '').toLowerCase();
  if (v.includes('direct')) return 'direct';
  if (v.includes('persuasive') || v.includes('persuas')) return 'persuasive';
  if (v.includes('friendly') || v.includes('amig')) return 'friendly';
  if (v.includes('formal')) return 'formal';
  return 'professional';
}

function templates(lang, keyword, topic) {
  const base = withTopic(keyword, topic, lang);

  return new Map([
    [
      'professional',
      [
        pick(`How ${base} improves results`, `Cómo ${base} mejora resultados`, lang),
        pick(`${base}: a practical guide`, `${base}: guía práctica`, lang),
        pick(`${base} checklist for better performance`, `Checklist de ${base} para mejor rendimiento`, lang),
        pick(`Best practices for ${base}`, `Mejores prácticas para ${base}`, lang),
        pick(`${base}: what to do first`, `${base}: qué hacer primero`, lang),
      ],
    ],
    [
      'direct',
      [
        pick(`${base} that works (no fluff)`, `${base} que sí funciona (sin relleno)`, lang),
        pick(`Fix ${base} in 7 steps`, `Arregla ${base} en 7 pasos`, lang),
        pick(`${base}: stop doing this`, `${base}: deja de hacer esto`, lang),
        pick(`The fastest way to ${base}`, `La forma más rápida de ${base}`, lang),
        pick(`${base}: do this today`, `${base}: haz esto hoy`, lang),
      ],
    ],
    [
      'friendly',
      [
        pick(`A simple way to get ${base}`, `Una forma simple de lograr ${base}`, lang),
        pick(`${base} made easy`, `${base} explicado fácil`, lang),
        pick(`Let’s talk about ${base}`, `Hablemos de ${base}`, lang),
        pick(`What I wish I knew about ${base}`, `Lo que me hubiera gustado saber sobre ${base}`, lang),
        pick(`${base} for beginners`, `${base} para principiantes`, lang),
      ],
    ],
    [
      'persuasive',
      [
        pick(`Why ${base} is your next growth lever`, `Por qué ${base} es tu próximo impulso de crecimiento`, lang),
        pick(`${base}: turn visitors into customers`, `${base}: convierte visitas en clientes`, lang),
        pick(`The real reason you need ${base}`, `La verdadera razón por la que necesitas ${base}`, lang),
        pick(`${base}: boost clicks and conversions`, `${base}: aumenta clics y conversiones`, lang),
        pick(`Get ${base} without wasting budget`, `Logra ${base} sin malgastar presupuesto`, lang),
      ],
    ],
    [
      'formal',
      [
        pick(`${base}: key considerations`, `${base}: consideraciones clave`, lang),
        pick(`${base}: framework and methodology`, `${base}: marco y metodología`, lang),
        pick(`${base}: implementation overview`, `${base}: resumen de implementación`, lang),
        pick(`${base}: evaluation criteria`, `${base}: criterios de evaluación`, lang),
        pick(`${base}: common risks and mitigations`, `${base}: riesgos comunes y mitigaciones`, lang),
      ],
    ],
  ]);
}

function generateTitlesFallback(lang, tone, keyword, topic) {
  const baseK = normalizeSpaces(keyword);
  const extra = normalizeSpaces(topic);
  const tMap = templates(lang, keyword, topic);
  const t = tMap.get(normalizeToneToFallbackKey(tone)) || [];

  const more = [
    pick(`${baseK} ideas you can use today`, `Ideas de ${baseK} para aplicar hoy`, lang),
    pick(`${baseK}: mistakes to avoid`, `${baseK}: errores que debes evitar`, lang),
    pick(`${baseK}: examples and templates`, `${baseK}: ejemplos y plantillas`, lang),
    pick(`${baseK}: quick wins`, `${baseK}: mejoras rápidas`, lang),
    pick(`${baseK} strategy for ${extra || '2026'}`, `Estrategia de ${baseK} para ${extra || '2026'}`, lang),
  ];

  const all = [...t, ...more].map((s) => normalizeSpaces(s)).filter(Boolean);
  const uniq = [];
  for (const item of all) {
    if (!uniq.includes(item)) uniq.push(item);
  }
  return uniq.slice(0, 10);
}

function renderTitles(resultsEl, titles) {
  resultsEl.innerHTML = '';
  for (const title of titles) {
    const li = document.createElement('li');
    li.textContent = title;
    resultsEl.appendChild(li);
  }
}

function getTitlesText(resultsEl) {
  const items = Array.from(resultsEl.querySelectorAll('li')).map((li) => li.textContent || '');
  return items.filter(Boolean).join('\n');
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function generateTitlesAI({ language, tone, keyword, topic }) {
  const res = await fetch('/.netlify/functions/generate-titles', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ language, tone, keyword, topic }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const msg = detail && detail.error ? detail.error : 'Failed to generate titles';
    throw new Error(msg);
  }

  const data = await res.json();
  return Array.isArray(data && data.titles) ? data.titles : [];
}

function getStringValue(el) {
  return el && typeof el.value === 'string' ? el.value : '';
}

function setBusy(generateBtn, isBusy, busyText, idleText) {
  generateBtn.disabled = isBusy;
  generateBtn.textContent = isBusy ? busyText : idleText;
}

const scriptEl = document.currentScript;
const defaultLang = scriptEl && scriptEl.dataset && scriptEl.dataset.defaultLang ? scriptEl.dataset.defaultLang : 'es';

const form = document.getElementById('titleForm');
const resultsEl = document.getElementById('results');
const emptyEl = document.getElementById('empty');
const metaEl = document.getElementById('meta');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');

const langEl = document.getElementById('lang');
const toneEl = document.getElementById('tone');
const keywordEl = document.getElementById('keyword');
const topicEl = document.getElementById('topic');

if (form && resultsEl && emptyEl && metaEl && copyBtn && downloadBtn && generateBtn && toneEl && keywordEl && topicEl) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const language = langEl ? getStringValue(langEl) : defaultLang;
    const tone = getStringValue(toneEl);
    const keyword = getStringValue(keywordEl);
    const topic = getStringValue(topicEl);

    setBusy(
      generateBtn,
      true,
      defaultLang === 'en' ? 'Generating…' : 'Generando…',
      defaultLang === 'en' ? 'Generate titles (AI)' : 'Generar títulos (IA)'
    );

    generateTitlesAI({ language, tone, keyword, topic })
      .catch(() => generateTitlesFallback(language, tone, keyword, topic))
      .then((titles) => {
        renderTitles(resultsEl, titles);
        emptyEl.style.display = titles.length ? 'none' : 'block';
        metaEl.textContent = titles.length
          ? defaultLang === 'en'
            ? `${titles.length} titles`
            : `${titles.length} títulos`
          : '';
        copyBtn.disabled = titles.length === 0;
        downloadBtn.disabled = titles.length === 0;
      })
      .finally(() => setBusy(
        generateBtn,
        false,
        defaultLang === 'en' ? 'Generating…' : 'Generando…',
        defaultLang === 'en' ? 'Generate titles (AI)' : 'Generar títulos (IA)'
      ));
  });

  copyBtn.addEventListener('click', async () => {
    const text = getTitlesText(resultsEl);
    if (!text) return;
    await copyToClipboard(text);
    copyBtn.textContent = defaultLang === 'en' ? 'Copied' : 'Copiado';
    setTimeout(() => (copyBtn.textContent = defaultLang === 'en' ? 'Copy' : 'Copiar'), 1200);
  });

  downloadBtn.addEventListener('click', () => {
    const text = getTitlesText(resultsEl);
    if (!text) return;
    downloadText(defaultLang === 'en' ? 'seo-titles.txt' : 'titulos-seo.txt', text);
  });
}

