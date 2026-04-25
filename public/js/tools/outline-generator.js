function normalizeSpaces(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function splitKeywords(value) {
  return normalizeSpaces(value)
    .split(',')
    .map((k) => normalizeSpaces(k))
    .filter(Boolean)
    .slice(0, 12);
}

function capitalize(value) {
  const s = normalizeSpaces(value);
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildOutline({ topic, primary, secondary, type, lang }) {
  const t = capitalize(topic);
  const k = normalizeSpaces(primary);
  const secondaryList = splitKeywords(secondary);
  const typeKey = String(type || '').toLowerCase();
  const isService = typeKey === 'servicio' || typeKey === 'local' || typeKey === 'service';
  const isComparison = typeKey === 'comparacion' || typeKey === 'comparison' || typeKey === 'comparativa';

  const lines = [];
  if (lang === 'en') {
    lines.push(`H1: ${t}`);
    lines.push('');
    lines.push('Introduction');
    lines.push('- Context + problem');
    lines.push(`- Use the main keyword: "${k}" naturally`);
    lines.push('');
  } else {
    lines.push(`H1: ${t}`);
    lines.push('');
    lines.push('Introducción');
    lines.push('- Contexto + problema');
    lines.push(`- Incluir keyword principal: "${k}" de forma natural`);
    lines.push('');
  }

  if (isService) {
    if (lang === 'en') {
      lines.push('H2: Who this service is for');
      lines.push('- Ideal profile');
      lines.push('- Common problems');
      lines.push('');
      lines.push('H2: What’s included');
      lines.push('- Deliverables');
      lines.push('- Coverage / areas (if applicable)');
      lines.push('');
      lines.push('H2: Process');
      lines.push('- Step 1');
      lines.push('- Step 2');
      lines.push('- Step 3');
      lines.push('');
    } else {
      lines.push('H2: Para quién es este servicio');
      lines.push('- Perfil ideal');
      lines.push('- Problemas comunes');
      lines.push('');
      lines.push('H2: Qué incluye');
      lines.push('- Lista de entregables');
      lines.push('- Áreas / cobertura (si aplica)');
      lines.push('');
      lines.push('H2: Proceso de trabajo');
      lines.push('- Paso 1');
      lines.push('- Paso 2');
      lines.push('- Paso 3');
      lines.push('');
    }
  } else if (isComparison) {
    if (lang === 'en') {
      lines.push(`H2: What to evaluate before choosing ${k}`);
      lines.push('- Criteria');
      lines.push('');
      lines.push('H2: Comparison table');
      lines.push('- Rows: features, price, pros/cons');
      lines.push('');
    } else {
      lines.push(`H2: Qué evaluar antes de elegir ${k}`);
      lines.push('- Criterios');
      lines.push('');
      lines.push('H2: Tabla comparativa');
      lines.push('- Filas: características, precio, pros/contras');
      lines.push('');
    }
  } else {
    if (lang === 'en') {
      lines.push(`H2: What is ${k}`);
      lines.push('- Definition');
      lines.push('- Why it matters');
      lines.push('');
      lines.push(`H2: Benefits of ${k}`);
      lines.push('- Benefit 1');
      lines.push('- Benefit 2');
      lines.push('- Benefit 3');
      lines.push('');
    } else {
      lines.push(`H2: Qué es ${k}`);
      lines.push('- Definición');
      lines.push('- Por qué importa');
      lines.push('');
      lines.push(`H2: Beneficios de ${k}`);
      lines.push('- Beneficio 1');
      lines.push('- Beneficio 2');
      lines.push('- Beneficio 3');
      lines.push('');
    }
  }

  if (lang === 'en') {
    lines.push('H2: Step-by-step');
    lines.push('- H3: Step 1');
    lines.push('- H3: Step 2');
    lines.push('- H3: Step 3');
    lines.push('');
  } else {
    lines.push('H2: Paso a paso');
    lines.push('- H3: Paso 1');
    lines.push('- H3: Paso 2');
    lines.push('- H3: Paso 3');
    lines.push('');
  }

  if (secondaryList.length) {
    if (lang === 'en') {
      lines.push('H2: Related topics to cover');
      for (const sk of secondaryList) {
        lines.push(`- H3: ${capitalize(sk)}`);
      }
      lines.push('');
    } else {
      lines.push('H2: Temas relacionados a cubrir');
      for (const sk of secondaryList) {
        lines.push(`- H3: ${capitalize(sk)}`);
      }
      lines.push('');
    }
  }

  if (lang === 'en') {
    lines.push('H2: Common mistakes');
    lines.push('- Mistake #1');
    lines.push('- Mistake #2');
    lines.push('- Mistake #3');
    lines.push('');
    lines.push('H2: FAQ');
    lines.push(`- What’s the best way to start with ${k}?`);
    lines.push(`- How long until you see results with ${k}?`);
    lines.push(`- What should I avoid when doing ${k}?`);
    lines.push('');
    lines.push('H2: Conclusion');
    lines.push('- Summary');
    lines.push('- CTA');
  } else {
    lines.push('H2: Errores comunes');
    lines.push('- Error #1');
    lines.push('- Error #2');
    lines.push('- Error #3');
    lines.push('');
    lines.push('H2: Preguntas frecuentes (FAQ)');
    lines.push(`- ¿Cuál es la mejor forma de empezar con ${k}?`);
    lines.push(`- ¿Cuánto tarda en verse resultado con ${k}?`);
    lines.push(`- ¿Qué debo evitar al hacer ${k}?`);
    lines.push('');
    lines.push('H2: Conclusión');
    lines.push('- Resumen');
    lines.push('- CTA');
  }

  return lines.join('\n');
}

async function generateOutlineAI({ language, main_keyword, related_keywords, competitor_json }) {
  const res = await fetch('/.netlify/functions/generate-outline', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ language, main_keyword, related_keywords, competitor_json }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const msg = detail && detail.error ? detail.error : 'Failed to generate outline';
    throw new Error(msg);
  }

  const data = await res.json();
  return String(data && data.outline ? data.outline : '').trim();
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

function getStringValue(el) {
  return el && typeof el.value === 'string' ? el.value : '';
}

function setBusy(generateBtn, isBusy, busyText, idleText) {
  generateBtn.disabled = isBusy;
  generateBtn.textContent = isBusy ? busyText : idleText;
}

const scriptEl = document.currentScript;
const defaultLang = scriptEl && scriptEl.dataset && scriptEl.dataset.defaultLang ? scriptEl.dataset.defaultLang : 'es';

const form = document.getElementById('outlineForm');
const output = document.getElementById('output');
const emptyEl = document.getElementById('empty');
const metaEl = document.getElementById('meta');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');

const topicEl = document.getElementById('topic');
const primaryEl = document.getElementById('primary');
const secondaryEl = document.getElementById('secondary');
const typeEl = document.getElementById('type');
const competitorJsonEl = document.getElementById('competitorJson');

if (form && output && emptyEl && metaEl && copyBtn && downloadBtn && generateBtn && topicEl && primaryEl && secondaryEl && typeEl) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const topic = getStringValue(topicEl);
    const primary = getStringValue(primaryEl);
    const secondary = getStringValue(secondaryEl);
    const type = getStringValue(typeEl) || 'blog';
    const competitorJson = competitorJsonEl ? getStringValue(competitorJsonEl) : '';
    const related = splitKeywords(secondary);

    setBusy(
      generateBtn,
      true,
      defaultLang === 'en' ? 'Generating…' : 'Generando…',
      defaultLang === 'en' ? 'Generate outline (AI)' : 'Generar estructura (IA)'
    );

    generateOutlineAI({ language: defaultLang, main_keyword: primary, related_keywords: related, competitor_json: competitorJson })
      .catch(() => buildOutline({ topic, primary, secondary, type, lang: defaultLang }))
      .then((text) => {
        output.textContent = text;
        emptyEl.style.display = text ? 'none' : 'block';
        metaEl.textContent = text
          ? defaultLang === 'en'
            ? `~${String(text).split('\n').length} lines`
            : `~${String(text).split('\n').length} líneas`
          : '';
        copyBtn.disabled = !text;
        downloadBtn.disabled = !text;
      })
      .finally(() => setBusy(
        generateBtn,
        false,
        defaultLang === 'en' ? 'Generating…' : 'Generando…',
        defaultLang === 'en' ? 'Generate outline (AI)' : 'Generar estructura (IA)'
      ));
  });

  copyBtn.addEventListener('click', async () => {
    const text = output.textContent || '';
    if (!text) return;
    await copyToClipboard(text);
    copyBtn.textContent = defaultLang === 'en' ? 'Copied' : 'Copiado';
    setTimeout(() => (copyBtn.textContent = defaultLang === 'en' ? 'Copy' : 'Copiar'), 1200);
  });

  downloadBtn.addEventListener('click', () => {
    const text = output.textContent || '';
    if (!text) return;
    downloadText(defaultLang === 'en' ? 'article-outline.txt' : 'estructura-articulo.txt', text);
  });
}
