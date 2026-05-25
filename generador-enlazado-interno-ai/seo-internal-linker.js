#!/usr/bin/env node

/**
 * SEO Internal Linker - Script de Enlazado Interno Inteligente
 * Utiliza múltiples IAs (Xiaomi AI, Grok AI, Kimi AI) para generar enlaces internos contextuales
 * Compatible con Astro, Next.js y VSC
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURACIÓN DE APIs
// ==========================================

const AI_APIS = {
  xiaomi: {
    endpoint: process.env.XIAOMI_API_ENDPOINT || '',
    apiKey: process.env.XIAOMI_API_KEY || '',
    model: process.env.XIAOMI_MODEL || 'xiaomi-ai-v1'
  },
  grok: {
    endpoint: process.env.GROK_API_ENDPOINT || 'https://api.x.ai/v1/chat/completions',
    apiKey: process.env.GROK_API_KEY || '',
    model: process.env.GROK_MODEL || 'grok-beta'
  },
  kimi: {
    endpoint: process.env.KIMI_API_ENDPOINT || 'https://api.moonshot.cn/v1/chat/completions',
    apiKey: process.env.KIMI_API_KEY || '',
    model: process.env.KIMI_MODEL || 'moonshot-v1-8k'
  }
};

// ==========================================
// CONFIGURACIÓN DEL PROYECTO
// ==========================================

const PROJECT_CONFIG = {
  supportedExtensions: ['.md', '.mdx'],
  preferredAI: process.env.PREFERRED_AI || 'auto',
  minLinks: parseInt(process.env.MIN_LINKS) || 3,
  maxLinks: parseInt(process.env.MAX_LINKS) || 8,
  createBackup: process.env.CREATE_BACKUP !== 'false'
};

// ==========================================
// PROMPT PARA LAS IAs
// ==========================================

const AI_SYSTEM_PROMPT = `Eres un experto en SEO y enlazado interno. Tu tarea es analizar un artículo y sugerir enlaces internos que:

1. APORTEN VALOR REAL: Los enlaces deben conectar conceptos relacionados y profundizar en temas mencionados
2. CONTEXTO NATURAL: Cada enlace debe tener un texto ancla descriptivo (15-40 caracteres) que indique claramente el tema
3. NO REPETICIÓN: NUNCA uses el mismo texto ancla dos veces en el mismo artículo
4. DISTRIBUCIÓN EQUILIBRADA: Distribuye los enlaces a lo largo del artículo, no todos al principio
5. RELEVANCIA SEMÁNTICA: Solo enlaza cuando hay conexión temática real

REGLAS ESTRICTAS:
- Máximo 1 enlace por cada 150-200 palabras
- El texto ancla debe ser específico: "estrategias de link building" NO "haz clic aquí"
- NO enlaces la misma palabra/frase más de una vez
- Los enlaces deben fluir naturalmente en el contexto
- Sugiere URLs descriptivas basadas en el tema (ejemplo: /blog/estrategias-seo-tecnico)

FORMATO DE RESPUESTA (JSON):
{
  "links": [
    {
      "anchorText": "texto ancla descriptivo",
      "suggestedUrl": "/blog/url-sugerida",
      "context": "fragmento del párrafo donde va el enlace (30-50 palabras)",
      "reason": "por qué este enlace aporta valor",
      "position": "aproximado en el artículo (inicio/medio/final)"
    }
  ],
  "analysis": {
    "mainTopic": "tema principal del artículo",
    "subtopics": ["subtemas identificados"],
    "linkingOpportunities": 5
  }
}`;

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Lee el contenido del artículo
 */
function readArticle(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Archivo no encontrado: ${fullPath}`);
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    console.log(`✅ Artículo leído: ${path.basename(filePath)} (${content.length} caracteres)`);
    return content;
  } catch (error) {
    console.error(`❌ Error al leer el artículo: ${error.message}`);
    process.exit(1);
  }
}

function loadDotEnv(dotEnvPath) {
  try {
    if (!fs.existsSync(dotEnvPath)) return;
    const raw = fs.readFileSync(dotEnvPath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && !(key in process.env)) process.env[key] = value;
    }
  } catch {}
}

function resolveWorkspaceRoot() {
  const candidates = [
    process.cwd(),
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '..', '..')
  ];

  const looksLikeRoot = (dir) =>
    fs.existsSync(path.join(dir, 'astro.config.mjs')) &&
    fs.existsSync(path.join(dir, 'src', 'content', 'blog'));

  for (const dir of candidates) {
    if (looksLikeRoot(dir)) return dir;
  }

  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    if (looksLikeRoot(currentDir)) return currentDir;
    currentDir = path.dirname(currentDir);
  }

  return process.cwd();
}

function mapContentFileToUrlPath(filePath, contentRoot) {
  const rel = path.relative(contentRoot, filePath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.(md|mdx)$/i, '');

  const isEn = noExt.startsWith('en/');
  const id = isEn ? noExt.slice('en/'.length) : noExt;

  const mapByPrefix = (prefix, base) => {
    if (!id.startsWith(prefix)) return '';
    const rest = id.slice(prefix.length);
    return `${base}${rest}/`;
  };

  if (isEn) {
    return (
      mapByPrefix('seo/', '/en/seo/') ||
      mapByPrefix('web-design/', '/en/web-design/') ||
      mapByPrefix('digital-marketing/', '/en/digital-marketing/') ||
      mapByPrefix('social-media/', '/en/social-media/') ||
      `/en/blog/${id}/`
    );
  }

  return (
    mapByPrefix('seo/', '/seo/') ||
    mapByPrefix('disenoweb/', '/disenoweb/') ||
    mapByPrefix('marketing-digital/', '/marketing-digital/') ||
    mapByPrefix('social-media/', '/social-media/') ||
    `/blog/${id}/`
  );
}

/**
 * Escanea el directorio de contenido para obtener artículos existentes
 */
function scanContentDirectory(workspaceRoot, targetArticleFullPath) {
  const contentRoot = path.join(workspaceRoot, 'src', 'content', 'blog');
  const files = getAllMarkdownFiles(contentRoot);
  const targetNorm = path.resolve(targetArticleFullPath);

  const articles = files
    .filter((fp) => path.resolve(fp) !== targetNorm)
    .map((file) => ({
      path: file,
      id: path.relative(contentRoot, file).replace(/\\/g, '/').replace(/\.(md|mdx)$/i, ''),
      title: extractTitle(file),
      slug: path.basename(file, path.extname(file)),
      urlPath: mapContentFileToUrlPath(file, contentRoot)
    }));

  console.log(`📚 Encontrados ${articles.length} artículos en el proyecto (astro)`);
  return articles;
}

/**
 * Encuentra la raíz del proyecto
 */
function findProjectRoot(startPath) {
  let currentDir = path.dirname(path.resolve(startPath));
  
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return path.dirname(path.resolve(startPath));
}

/**
 * Detecta el framework del proyecto
 */
function detectFramework(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps.astro) return 'astro';
    if (deps.next) return 'nextjs';
  }
  
  return 'vsc';
}

/**
 * Obtiene todos los archivos markdown recursivamente
 */
function getAllMarkdownFiles(dir) {
  let results = [];
  
  if (!fs.existsSync(dir)) return results;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (PROJECT_CONFIG.supportedExtensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  }
  
  return results;
}

/**
 * Extrae el título del artículo (frontmatter o primer H1)
 */
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Buscar en frontmatter
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*['"]?([^'"]+)['"]?/);
      if (titleMatch) return titleMatch[1];
    }
    
    // Buscar primer H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) return h1Match[1];
    
    return path.basename(filePath, path.extname(filePath))
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  } catch {
    return path.basename(filePath, path.extname(filePath));
  }
}

/**
 * Llama a la API de IA seleccionada
 */
async function callAI(content, existingArticles, aiProvider = 'auto') {
  // Selección automática de IA
  if (aiProvider === 'auto') {
    if (AI_APIS.grok.apiKey) aiProvider = 'grok';
    else if (AI_APIS.kimi.apiKey) aiProvider = 'kimi';
    else if (AI_APIS.xiaomi.apiKey) aiProvider = 'xiaomi';
    else {
      return suggestLinksLocally(content, existingArticles);
    }
  }
  
  const config = AI_APIS[aiProvider];
  
  if (!config.apiKey) {
    throw new Error(`API key no configurada para ${aiProvider.toUpperCase()}`);
  }
  
  console.log(`🤖 Usando ${aiProvider.toUpperCase()} AI para análisis...`);
  
  const userPrompt = `Analiza este artículo y sugiere enlaces internos estratégicos:

CONTENIDO DEL ARTÍCULO:
${content.substring(0, 8000)} ${content.length > 8000 ? '...(contenido truncado)' : ''}

ARTÍCULOS EXISTENTES EN EL SITIO:
${existingArticles.slice(0, 50).map(a => `- ${a.title} (slug: ${a.slug})`).join('\n')}

Recuerda:
- NO repitas textos ancla
- Los enlaces deben aportar valor contextual
- Sugiere entre ${PROJECT_CONFIG.minLinks} y ${PROJECT_CONFIG.maxLinks} enlaces
- Distribuye los enlaces a lo largo del artículo`;

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API ${aiProvider} respondió con error: ${response.status}`);
    }
    
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // Extraer JSON de la respuesta
    const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('La IA no devolvió un JSON válido');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`❌ Error al llamar a ${aiProvider} AI:`, error.message);
    
    // Intentar con otra IA como fallback
    const fallbackOrder = ['grok', 'kimi', 'xiaomi'].filter(ai => ai !== aiProvider && AI_APIS[ai].apiKey);
    if (fallbackOrder.length > 0) {
      console.log(`🔄 Intentando con ${fallbackOrder[0].toUpperCase()} como alternativa...`);
      return callAI(content, existingArticles, fallbackOrder[0]);
    }
    
    throw error;
  }
}

function normalizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitWords(text) {
  return normalizeWords(text).split(' ').filter(Boolean);
}

function extractContextAroundIndex(content, index, wordWindow = 30) {
  const before = content.slice(0, Math.max(0, index));
  const after = content.slice(index);
  const beforeWords = before.split(/\s+/).filter(Boolean);
  const afterWords = after.split(/\s+/).filter(Boolean);
  const start = Math.max(0, beforeWords.length - wordWindow);
  const end = Math.min(afterWords.length, wordWindow);
  return [...beforeWords.slice(start), ...afterWords.slice(0, end)].join(' ');
}

function findAnchorFromTitleInContent(title, content) {
  const rawTitleWords = splitWords(title).filter((w) => w.length >= 4);
  if (rawTitleWords.length < 2) return null;

  const contentLower = content.toLowerCase();
  const sizes = [5, 4, 3, 2];
  for (const size of sizes) {
    if (rawTitleWords.length < size) continue;
    for (let i = 0; i <= rawTitleWords.length - size; i++) {
      const phrase = rawTitleWords.slice(i, i + size).join(' ');
      if (phrase.length < 10) continue;
      const idx = contentLower.indexOf(phrase);
      if (idx !== -1) {
        const original = content.slice(idx, idx + phrase.length);
        return { anchorText: original, index: idx };
      }
    }
  }

  return null;
}

function suggestLinksLocally(content, existingArticles) {
  const usedAnchors = new Set();
  const links = [];

  const contentWords = new Set(splitWords(content).filter((w) => w.length >= 5));

  const scored = existingArticles
    .map((a) => {
      const titleWords = splitWords(a.title).filter((w) => w.length >= 5);
      const overlap = titleWords.reduce((acc, w) => (contentWords.has(w) ? acc + 1 : acc), 0);
      return { article: a, score: overlap };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

  for (const { article } of scored) {
    if (links.length >= PROJECT_CONFIG.maxLinks) break;
    if (!article.urlPath) continue;

    const match = findAnchorFromTitleInContent(article.title, content);
    if (!match) continue;

    const key = match.anchorText.toLowerCase();
    if (usedAnchors.has(key)) continue;

    const posRatio = match.index / Math.max(1, content.length);
    const position = posRatio < 0.33 ? 'inicio' : posRatio < 0.66 ? 'medio' : 'final';

    links.push({
      anchorText: match.anchorText,
      suggestedUrl: article.urlPath,
      context: extractContextAroundIndex(content, match.index, 35),
      reason: `Relacionado con "${article.title}"`,
      position
    });
    usedAnchors.add(key);
  }

  const analysis = {
    mainTopic: extractTitleFromContent(content) || 'Artículo',
    subtopics: [],
    linkingOpportunities: links.length
  };

  const clipped = links.slice(0, PROJECT_CONFIG.maxLinks);
  const min = Math.min(PROJECT_CONFIG.minLinks, clipped.length);
  return { links: clipped.slice(0, Math.max(min, clipped.length)), analysis };
}

function extractTitleFromContent(content) {
  const frontmatterMatch = String(content || '').match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*['"]?([^'"]+)['"]?/);
    if (titleMatch) return titleMatch[1];
  }
  const h1Match = String(content || '').match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  return '';
}

/**
 * Inserta los enlaces en el contenido
 */
function insertLinks(content, links) {
  let modifiedContent = content;
  let insertedLinks = 0;
  const usedAnchors = new Set();
  
  for (const link of links) {
    // Verificar que no se repita el texto ancla
    if (usedAnchors.has(link.anchorText.toLowerCase())) {
      console.log(`⚠️  Enlace omitido (texto ancla duplicado): "${link.anchorText}"`);
      continue;
    }
    
    // Buscar el texto ancla en el contenido (case-insensitive pero respetando formato)
    const regex = new RegExp(`\\b${escapeRegex(link.anchorText)}\\b`, 'i');
    const match = modifiedContent.match(regex);
    
    if (match) {
      const originalText = match[0];
      const markdownLink = `[${originalText}](${link.suggestedUrl})`;
      
      // Reemplazar solo la primera ocurrencia
      modifiedContent = modifiedContent.replace(regex, markdownLink);
      usedAnchors.add(link.anchorText.toLowerCase());
      insertedLinks++;
      
      console.log(`✅ Enlace insertado: "${originalText}" → ${link.suggestedUrl}`);
    } else {
      console.log(`⚠️  No se encontró el texto: "${link.anchorText}"`);
    }
  }
  
  console.log(`\n📊 Total de enlaces insertados: ${insertedLinks}/${links.length}`);
  return { content: modifiedContent, insertedLinks };
}

/**
 * Escapa caracteres especiales para regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Crea un backup del archivo original
 */
function createBackup(filePath) {
  const backupPath = filePath + '.backup.' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`💾 Backup creado: ${path.basename(backupPath)}`);
  return backupPath;
}

/**
 * Guarda el contenido modificado
 */
function saveArticle(filePath, content) {
  if (PROJECT_CONFIG.createBackup) {
    createBackup(filePath);
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`💾 Artículo guardado: ${filePath}`);
}

/**
 * Muestra un reporte del enlazado
 */
function showReport(analysis, links, insertedCount) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 REPORTE DE ENLAZADO INTERNO');
  console.log('='.repeat(60));
  console.log(`\n🎯 Tema principal: ${analysis.mainTopic}`);
  console.log(`📌 Subtemas: ${analysis.subtopics.join(', ')}`);
  console.log(`🔗 Enlaces sugeridos: ${links.length}`);
  console.log(`✅ Enlaces insertados: ${insertedCount}`);
  console.log(`📈 Oportunidades de enlazado: ${analysis.linkingOpportunities}`);
  console.log('\n' + '='.repeat(60) + '\n');
}

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

async function main() {
  console.log('🚀 SEO Internal Linker - Iniciando...\n');

  const workspaceRoot = resolveWorkspaceRoot();
  loadDotEnv(path.join(workspaceRoot, '.env'));
  loadDotEnv(path.join(__dirname, '.env'));

  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.indexOf(name);
    if (idx === -1) return '';
    return args[idx + 1] || '';
  };
  const hasFlag = (name) => args.includes(name);

  const articleArg = getArg('--article') || process.env.ARTICLE_PATH || '';
  if (!articleArg) {
    console.error('❌ ERROR: Debes indicar el artículo con --article "src/content/blog/archivo.md"');
    process.exit(1);
  }

  const dryRun = hasFlag('--dry-run') || process.env.DRY_RUN === 'true';

  const articleFullPath = path.isAbsolute(articleArg) ? articleArg : path.join(workspaceRoot, articleArg);

  try {
    // 1. Leer el artículo
    const content = readArticle(articleFullPath);
    
    // 2. Escanear artículos existentes
    const existingArticles = scanContentDirectory(workspaceRoot, articleFullPath);
    const contentRoot = path.join(workspaceRoot, 'src', 'content', 'blog');
    const targetRel = path.relative(contentRoot, articleFullPath).replace(/\\/g, '/');
    const targetIsEn = targetRel.startsWith('en/');
    const allowCrossLang = process.env.ALLOW_CROSS_LANG === 'true';
    const sameLangArticles = allowCrossLang
      ? existingArticles
      : existingArticles.filter((a) => (targetIsEn ? a.id.startsWith('en/') : !a.id.startsWith('en/')));
    
    // 3. Llamar a la IA para análisis
    console.log('\n🧠 Analizando contenido con IA...');
    const result = await callAI(content, sameLangArticles, PROJECT_CONFIG.preferredAI);
    
    // 4. Insertar enlaces
    console.log('\n🔗 Insertando enlaces internos...\n');
    const insertion = insertLinks(content, result.links);
    
    // 5. Guardar artículo modificado
    if (dryRun) {
      console.log('\n🧪 DRY RUN: No se guardaron cambios');
    } else {
      saveArticle(articleFullPath, insertion.content);
    }
    
    // 6. Mostrar reporte
    showReport(result.analysis, result.links, insertion.insertedLinks);
    
    console.log('✨ Proceso completado exitosamente\n');
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// ==========================================
// EJECUTAR
// ==========================================

if (require.main === module) {
  main();
}

module.exports = { main, readArticle, insertLinks, scanContentDirectory };
