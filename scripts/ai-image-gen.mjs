import fs from 'node:fs';
import path from 'node:path';

function loadEnvFromFileIfPresent() {
  const candidates = ['.env', '.ENV'];
  for (const filename of candidates) {
    const envPath = path.join(process.cwd(), filename);
    if (!fs.existsSync(envPath)) continue;
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const withoutExport = line.startsWith('export ') ? line.slice('export '.length).trim() : line;
        const eqIndex = withoutExport.indexOf('=');
        if (eqIndex === -1) continue;
        const key = withoutExport.slice(0, eqIndex).trim();
        let value = withoutExport.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key && !(key in process.env)) process.env[key] = value;
      }
      return;
    } catch {
      return;
    }
  }
}

loadEnvFromFileIfPresent();

const token = process.env.REPLICATE_API_TOKEN;
if (!token) {
  console.error('Error: REPLICATE_API_TOKEN no está configurado (usa .env o variable de entorno).');
  process.exit(1);
}

const MODEL = 'black-forest-labs/flux-schnell';
const OUTPUT_DIR = path.resolve(process.cwd(), 'public', 'assets', 'blog');
const CONTENT_BLOG_DIR = path.resolve(process.cwd(), 'src', 'content', 'blog');

const PROMPTS_BY_FILEBASE = {
  'chicken-souvlaki-recipe':
    'Realistic food photography, Greek chicken souvlaki skewers with grill marks on a wooden board, lemon wedges, oregano, tzatziki bowl, tomatoes and red onion on the side, outdoor grill or bright kitchen background, natural light, shallow depth of field, 16:9',
  'greek-vegetarian-pastitsio':
    'Realistic food photography, Greek vegetarian pastitsio in a ceramic baking dish on a rustic wooden kitchen table, golden bechamel top slightly browned, steam rising, oregano and nutmeg, Mediterranean kitchen background, soft natural window light, shallow depth of field, 16:9',
  'greek-pastitsio-recipe':
    'Realistic food photography, classic Greek pastitsio slice served on a plate, layers of pasta and rich meat sauce with thick golden bechamel top, parsley garnish, rustic Mediterranean kitchen background, soft natural window light, shallow depth of field, 16:9',
  'greek-vegan-dolmades':
    'Realistic food photography, Greek vegan dolmades (stuffed grape leaves) plated with lemon wedges and fresh dill, olive oil glistening, small bowl of lemon-garlic sauce, white marble countertop, bright natural light, 16:9',
  'greek-vegetarian-stuffed-peppers':
    'Realistic food photography, Greek vegetarian gemista stuffed peppers and tomatoes in a baking tray, rice and herbs filling visible, olive oil sheen, roasted edges, Mediterranean herbs scattered, warm home kitchen lighting, 16:9',
  'greek-vegetable-dishes':
    'Realistic food photography, Greek briam roasted Mediterranean vegetables in a large enamel roasting pan, zucchini eggplant potatoes tomatoes layered, caramelized edges, olive oil and oregano, rustic kitchen scene, 16:9',
  'greek-yogurt-recipes':
    'Realistic food photography, bowl of thick Greek yogurt with honey drizzle and walnuts, side of fresh berries, wooden spoon, linen napkin, bright airy kitchen, soft natural light, 16:9',
  'greek-gyro-recipe':
    'Realistic food photography, Greek gyro pita wrap cut in half, juicy sliced meat, tzatziki, tomatoes, red onion, fries inside, parchment paper wrap, street food style, natural daylight, 16:9',
  'greek-souvlaki-pita':
    'Realistic food photography, Greek chicken souvlaki in warm pita with tzatziki, tomatoes, red onion and oregano, grill marks visible, rustic wooden board, bright natural light, 16:9',
  'greek-pita-bread-recipe':
    'Realistic food photography, stack of warm homemade Greek pita breads on a linen cloth, slight char bubbles, olive oil and oregano on the side, wooden table, soft window light, 16:9',
  'greek-pita-sandwiches':
    'Realistic food photography, assortment of Greek pita sandwiches on a table, different fillings (gyro, souvlaki, falafel-style), bowls of tzatziki and chopped salad, Mediterranean colors, natural daylight, 16:9',
  'greek-vegan-moussaka':
    'Realistic food photography, Greek vegan moussaka in a baking dish, layers of eggplant and potatoes with lentil tomato ragù, creamy vegan béchamel top browned, fresh herbs, rustic kitchen background, 16:9',
  'greek-moussaka-recipe':
    'Realistic food photography, classic Greek moussaka slice on a plate, layered eggplant and meat sauce with thick béchamel, lightly browned top, parsley garnish, warm Mediterranean kitchen lighting, 16:9',
  'greek-spanakopita-recipe':
    'Realistic food photography, spanakopita (Greek spinach feta pie) with flaky golden phyllo layers, cut pieces on a wooden board, crumbs and herbs, bright natural light, 16:9',
  'greek-legume-recipes':
    'Realistic food photography, Greek lentil soup (fakes) in a bowl with olive oil drizzle and red wine vinegar, crusty bread on the side, rustic table, steam rising, soft natural window light, 16:9',
  'greek-salmon-recipes':
    'Realistic food photography, Greek-style salmon fillet with lemon, olive oil and oregano, served with Greek salad and roasted potatoes, bright natural light, 16:9',
  'greek-sheet-pan-dinners':
    'Realistic food photography, Greek sheet pan dinner on a baking tray: chicken pieces, potatoes, cherry tomatoes, olives, red onion, oregano and lemon wedges, golden roasted edges, overhead angle, 16:9',
  '30-minute-greek-meals':
    'Realistic food photography, quick Greek meal spread on a kitchen counter: Greek salad bowl, pita, tzatziki, grilled chicken, lemon wedges, minimal prep vibe, bright natural light, 16:9',
  'greek-recipes-beginners':
    'Realistic food photography, beginner Greek cooking essentials on a countertop: olive oil, lemons, garlic, oregano, feta, olives, tomatoes, pita bread, simple clean composition, bright natural light, 16:9',
  'quick-greek-dinner-ideas':
    'Realistic food photography, easy weeknight Greek dinner on the table: grilled protein, Greek salad, pita, tzatziki, lemon, cozy home setting, warm but natural lighting, 16:9',
  'healthy-greek-recipes':
    'Realistic food photography, healthy Greek bowl with grilled chicken, cucumber tomato salad, olives, feta, quinoa or rice, lemon and olive oil dressing, clean bright background, 16:9',
  'greek-pita-recipes':
    'Realistic food photography, Greek pita and bread assortment, homemade pitas, flatbreads, small bowls of tzatziki and olive oil, Mediterranean table styling, natural light, 16:9',
  'greek-vegetarian-recipes':
    'Realistic food photography, Greek vegetarian mezze spread: roasted vegetables, dolmades, Greek salad, hummus-style dip, pita, olives, colorful Mediterranean table, bright natural light, 16:9',
  'authentic-greek-recipes':
    'Realistic food photography, authentic Greek mezze table: olives, feta, tomatoes, cucumbers, grilled meats, lemon, olive oil, rustic tavern style, warm natural light, 16:9',
  'easy-greek-recipes':
    'Realistic food photography, easy Greek dinner ideas on a table: Greek salad, pita, tzatziki, roasted chicken, simple weeknight styling, bright natural light, 16:9',
  'greek-chicken-recipes':
    'Realistic food photography, assortment of Greek chicken dishes: souvlaki skewers, lemon potatoes, tzatziki, pita, Greek salad, Mediterranean table spread, natural light, 16:9',
  'ancient-greek-recipes':
    'Realistic food photography, ancient Greek inspired food still life: rustic bread, olives, figs, honey, clay amphora and ceramic bowls on a stone table, warm natural light, 16:9',
};

function titleFromFileBase(fileBase) {
  return fileBase
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildFallbackPrompt(fileBase, kind, meta) {
  const lower = fileBase.toLowerCase();

  const basePrompt = [
    'Professional blog hero image',
    'clean modern editorial illustration or realistic photography style',
    'high quality, sharp, well-lit',
    'no text, no letters, no words, no typography, no captions',
    'no logos, no watermarks, no signatures, no branding',
    'no readable UI text, no numbers, no labels',
    '16:9',
  ].join(', ');

  if (lower.includes('woocommerce') || lower.includes('wordpress') || lower.includes('core-web-vitals') || lower.includes('inp') || lower.includes('cls')) {
    return `${basePrompt}, eCommerce website performance concept, laptop and smartphone with abstract speed gauges and subtle charts (no readable text), fast loading and stability, modern minimal composition`;
  }

  if (lower.includes('seo') || lower.includes('rank') || lower.includes('backlink') || lower.includes('algoritmo') || lower.includes('autoridad')) {
    return `${basePrompt}, SEO concept, magnifying glass over abstract search results layout (no readable text), clean analytics-style charts without labels, modern minimal composition`;
  }

  if (lower.includes('marketing') || lower.includes('social') || lower.includes('campaign') || lower.includes('ads')) {
    return `${basePrompt}, digital marketing concept, abstract campaign performance charts without labels, audience nodes, growth arrow, social media shapes abstract (no brands, no text), modern minimal composition`;
  }

  if (kind === 'hero') {
    return `${basePrompt}, website performance and user experience concept, abstract fast loading interface, clean modern UI shapes without any readable text, minimal composition`;
  }

  return `${basePrompt}, website and analytics concept, abstract charts and interface elements without any readable text, minimal composition`;
}

function getPromptForFileBase(fileBase, kind, meta) {
  return PROMPTS_BY_FILEBASE[fileBase] ?? buildFallbackPrompt(fileBase, kind, meta);
}

function walkFiles(rootDir) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(markdown) {
  const trimmed = String(markdown || '');
  if (!trimmed.startsWith('---')) return null;
  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) return null;
  const raw = trimmed.slice(3, endIdx).trim();
  const meta = {};
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) value = value.slice(1, -1);
    meta[key] = value;
  }
  return meta;
}

function collectImageTargetsFromBlogContent() {
  const map = new Map();
  for (const filePath of walkFiles(CONTENT_BLOG_DIR)) {
    const lower = filePath.toLowerCase();
    if (!(lower.endsWith('.md') || lower.endsWith('.mdx'))) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const meta = parseFrontmatter(content) || {};
    const regex = /\/assets\/blog\/([a-z0-9-]+)\.(png|jpg|jpeg|webp)/gi;
    for (const match of content.matchAll(regex)) {
      const base = match[1];
      const ext = (match[2] || '').toLowerCase();
      if (!base || !ext) continue;
      const kind = String(meta.heroImageUrl || '').includes(`/assets/blog/${base}.${ext}`) ? 'hero' : 'inline';
      const key = `${base}.${ext}`;
      if (!map.has(key)) map.set(key, { kind, meta });
    }
  }
  return map;
}

const targets = collectImageTargetsFromBlogContent();
const items = [...targets.entries()].map(([fileName, info]) => {
  const dot = fileName.lastIndexOf('.');
  const fileBase = dot === -1 ? fileName : fileName.slice(0, dot);
  const ext = dot === -1 ? 'png' : fileName.slice(dot + 1).toLowerCase();
  const outputFormat = ext === 'jpg' || ext === 'jpeg' ? 'jpg' : ext === 'webp' ? 'webp' : 'png';
  const promptOverride = info?.meta?.aiImagePrompt || info?.meta?.imagePrompt || '';
  return {
    fileName,
    outputFormat,
    prompt: String(promptOverride).trim() || getPromptForFileBase(fileBase, info?.kind || 'hero', info?.meta),
  };
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let cachedModelVersionId;

async function getLatestModelVersionId(model) {
  if (cachedModelVersionId) return cachedModelVersionId;
  const [owner, name] = model.split('/');
  if (!owner || !name) throw new Error(`Invalid model id: ${model}`);

  const res = await fetch(`https://api.replicate.com/v1/models/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Replicate model lookup failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  const json = await res.json();
  const versionId = json?.latest_version?.id;
  if (!versionId) throw new Error('Could not resolve latest_version.id for model');
  cachedModelVersionId = versionId;
  return versionId;
}

async function replicateCreatePrediction({ prompt, outputFormat = 'png' }) {
  const version = await getLatestModelVersionId(MODEL);
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: outputFormat,
          output_quality: 100,
        },
      }),
    });

    if (res.status === 429) {
      let retryAfterSeconds = 10;
      const headerRetry = res.headers.get('retry-after');
      if (headerRetry && Number.isFinite(Number(headerRetry))) retryAfterSeconds = Number(headerRetry);
      try {
        const body = await res.json();
        if (Number.isFinite(Number(body?.retry_after))) retryAfterSeconds = Number(body.retry_after);
      } catch {
        // ignore
      }
      await sleep((retryAfterSeconds + 1) * 1000);
      continue;
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `Replicate create prediction failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`
      );
    }

    return res.json();
  }

  throw new Error('Replicate create prediction failed: exceeded retries');
}

async function replicateGetPrediction(id) {
  const res = await fetch(`https://api.replicate.com/v1/predictions/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Replicate get prediction failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  return res.json();
}

async function waitForPrediction(id) {
  let delayMs = 1200;
  for (let i = 0; i < 120; i++) {
    const pred = await replicateGetPrediction(id);
    if (pred.status === 'succeeded') return pred;
    if (pred.status === 'failed' || pred.status === 'canceled') {
      const detail = pred?.error ? ` - ${pred.error}` : '';
      throw new Error(`Prediction ${pred.status}${detail}`);
    }
    await sleep(delayMs);
    delayMs = Math.min(Math.round(delayMs * 1.25), 4000);
  }
  throw new Error('Prediction timeout');
}

async function downloadToFile(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(arrayBuffer));
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const item of items) {
  const outPath = path.join(OUTPUT_DIR, item.fileName);
  if (fs.existsSync(outPath)) {
    console.log(`SKIP: ${path.relative(process.cwd(), outPath)}`);
    continue;
  }
  console.log(`Generando: ${item.fileName}`);
  const created = await replicateCreatePrediction({ prompt: item.prompt, outputFormat: item.outputFormat });
  const predictionId = created?.id;
  if (!predictionId) throw new Error('Replicate did not return a prediction id');
  const done = await waitForPrediction(predictionId);
  const output = done?.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (!imageUrl) throw new Error('Replicate did not return an image URL');
  await downloadToFile(imageUrl, outPath);
  console.log(`OK: ${path.relative(process.cwd(), outPath)}`);
  await sleep(9000);
}
