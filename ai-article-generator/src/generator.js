import { AIClient } from './ai-client.js';
import { PromptReader } from './prompt-reader.js';
import { FileGenerator } from './file-generator.js';
import { config } from './config.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import readline from 'node:readline/promises';
import { stdin as stdinInput, stdout as stdoutOutput } from 'node:process';

export async function readAllFilesInDir(dirPath) {
  const resolvedDir = path.resolve(dirPath);
  let entries;
  try {
    entries = await fs.readdir(resolvedDir, { withFileTypes: true });
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return '';
    throw error;
  }

  const files = entries
    .filter(e => e.isFile())
    .map(e => path.join(resolvedDir, e.name))
    .sort((a, b) => a.localeCompare(b));

  const contents = [];
  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    contents.push(`ARCHIVO: ${path.basename(filePath)}\n\n${content}`);
  }
  return contents.join('\n\n');
}

export async function listTxtFilesInDir(dirPath) {
  const resolvedDir = path.resolve(dirPath);
  const entries = await fs.readdir(resolvedDir, { withFileTypes: true });
  const txtFiles = entries
    .filter(e => e.isFile() && e.name.toLowerCase().endsWith('.txt'))
    .map(e => path.join(resolvedDir, e.name));

  return txtFiles.sort((a, b) => a.localeCompare(b));
}

export async function readRequiredFile(filePath, humanName) {
  try {
    return await fs.readFile(path.resolve(filePath), 'utf-8');
  } catch (error) {
    throw new Error(`No se pudo leer ${humanName} (${filePath}): ${error.message}`);
  }
}

function sha12(text) {
  return crypto.createHash('sha256').update(text ?? '', 'utf8').digest('hex').slice(0, 12);
}

function logPromptParts({ globalInstructions, formatterExamples, researchContent }) {
  const parts = [
    ['prompts/promts.txt', globalInstructions],
    ['ejemplo-fromater/*', formatterExamples],
    ['informacion-txt/*.txt', researchContent]
  ];

  for (const [name, content] of parts) {
    const length = content?.length ?? 0;
    console.log(`  🧾 ${name}: ${length} chars (sha ${sha12(content)})`);
  }

  const total = (globalInstructions?.length ?? 0) + (formatterExamples?.length ?? 0) + (researchContent?.length ?? 0);
  const approxTokens = Math.ceil(total / 4);
  console.log(`  📏 Total aprox: ${total} chars (~${approxTokens} tokens)`);
}

export function buildUserContent({ formatterExamples, researchContent }) {
  return JSON.stringify(
    {
      formatterExamples: formatterExamples ?? '',
      input: researchContent ?? '',
    },
    null,
    2
  );
}

export function createMessages({ globalInstructions, formatterExamples, researchContent }) {
  return [
    { role: 'system', content: globalInstructions },
    { role: 'user', content: buildUserContent({ formatterExamples, researchContent }) }
  ];
}

function extractOutputDirFromGlobalInstructions(globalInstructions) {
  if (!globalInstructions) return null;

  const patterns = [
    /genera\s+y\s+guarda\s+el\s+md\s+en\s+esta\s+dirre?cion\s*:\s*(.+)/i,
    /genera\s+el\s+md\s+en\s+esta\s+dirre?cion\s*:\s*(.+)/i
  ];

  for (const re of patterns) {
    const match = globalInstructions.match(re);
    if (!match) continue;

    const raw = (match[1] ?? '').trim();
    const cleaned = raw.replace(/^['"]|['"]$/g, '').trim();
    if (!cleaned) return null;
    return cleaned;
  }

  return null;
}

function extractSeoTitleFromResearchContent(researchContent) {
  if (!researchContent) return null;

  const lines = researchContent.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = (lines[i] ?? '').trim();
    if (/^t[íi]tulo\s+seo\s+recomendado\s*:/i.test(line)) {
      for (let j = i + 1; j < lines.length; j++) {
        const candidate = (lines[j] ?? '').trim();
        if (!candidate) continue;
        return candidate;
      }
      return null;
    }
  }

  return null;
}

function extractFirstNonEmptyLine(text) {
  if (!text) return null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = (rawLine ?? '').trim();
    if (line) return line;
  }
  return null;
}

function slugifyFilename(input) {
  const s = String(input ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  const maxLen = 60;
  if (s.length <= maxLen) return s || 'articulo';

  const hardClip = s.slice(0, maxLen).replace(/-+$/g, '');
  const lastDash = hardClip.lastIndexOf('-');
  const softClip = lastDash > 0 ? hardClip.slice(0, lastDash) : hardClip;

  return softClip || hardClip || 'articulo';
}

function stripOuterMarkdownCodeFence(text) {
  if (!text) return text;
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/^```(?:\w+)?\s*\r?\n([\s\S]*?)\r?\n```\s*$/);
  if (!fenceMatch) return text;

  return (fenceMatch[1] ?? '').trim() + '\n';
}

function sanitizeForMdx(text) {
  if (!text) return text;

  // MDX interpreta `<2` (o `< 2`) como inicio de una etiqueta JSX inválida.
  // Escapamos solo el caso donde `<` va seguido de un número (con espacios opcionales).
  return text.replace(/<(?=\s*\d)/g, '&lt;');
}

function enforceTitle(article, desiredTitle) {
  if (!article || !desiredTitle) return article;
  const title = String(desiredTitle).trim();
  if (!title) return article;

  let out = article;

  // Update YAML frontmatter title if present at the top.
  out = out.replace(
    /^---\s*\r?\n([\s\S]*?)\r?\n---/,
    (full, body) => {
      const hasTitle = /^\s*title\s*:/im.test(body);
      let newBody;
      if (hasTitle) {
        newBody = body.replace(/^\s*title\s*:\s*.*$/im, `title: "${title.replace(/"/g, '\\"')}"`);
      } else {
        newBody = `title: "${title.replace(/"/g, '\\"')}"\n${body}`;
      }
      return `---\n${newBody}\n---`;
    }
  );

  // If the article contains a top-level H1, make it match too (optional but helps consistency).
  out = out.replace(/^(?:---[\s\S]*?\r?\n---\r?\n)?\s*#\s+.*$/m, (line) => {
    if (line.trim().startsWith('#')) {
      return `# ${title}`;
    }
    return line;
  });

  return out;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findRepoRoot(startDir) {
  const maxUp = 6;
  let current = path.resolve(startDir);
  for (let i = 0; i <= maxUp; i++) {
    const candidate = path.join(current, 'src', 'content', 'blog');
    if (await fileExists(candidate)) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function extractFrontmatterBlock(markdown) {
  if (!markdown) return null;
  const m = String(markdown).match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}

function extractFrontmatterField(frontmatterBody, key) {
  if (!frontmatterBody || !key) return '';
  const re = new RegExp(`^\\s*${key}\\s*:\\s*(.+)\\s*$`, 'im');
  const m = String(frontmatterBody).match(re);
  if (!m) return '';
  const raw = String(m[1] ?? '').trim();
  return raw.replace(/^['"]|['"]$/g, '').trim();
}

async function listContentFilesRecursive(dirPath) {
  const out = [];
  const stack = [dirPath];
  while (stack.length) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else if (e.isFile() && /\.(md|mdx)$/i.test(e.name)) {
        out.push(full);
      }
    }
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function summarizeExistingBlogPosts(repoRoot) {
  const blogDir = path.join(repoRoot, 'src', 'content', 'blog');
  if (!(await fileExists(blogDir))) return [];

  const files = await listContentFilesRecursive(blogDir);
  const summaries = [];

  for (const fp of files) {
    const raw = await fs.readFile(fp, 'utf-8');
    const fm = extractFrontmatterBlock(raw);
    const title = extractFrontmatterField(fm, 'title');
    const pubDate = extractFrontmatterField(fm, 'pubDate');
    const rel = path.relative(blogDir, fp).replace(/\\/g, '/');
    const id = rel.replace(/\.(md|mdx)$/i, '');
    if (!title) continue;
    summaries.push({ id, title, pubDate });
  }

  return summaries;
}

function wordCount(text) {
  const clean = String(text ?? '')
    .replace(/---[\s\S]*?---/g, ' ')
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return 0;
  return clean.split(' ').length;
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token) continue;
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function tryParseJsonFromModelOutput(text) {
  const raw = stripOuterMarkdownCodeFence(text);
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return { value: null, error: new Error('Empty output') };
  try {
    return { value: JSON.parse(trimmed), error: null };
  } catch (error) {
    return { value: null, error };
  }
}

function validatePlanTitles(plan, maxLen = 72) {
  const issues = [];
  const candidates = Array.isArray(plan)
    ? plan
    : Array.isArray(plan?.articles)
      ? plan.articles
      : [];

  const starters = new Set([
    'que',
    'qué',
    'cual',
    'cuál',
    'por',
    'porqué',
    'porqué',
    'donde',
    'dónde',
    'cuando',
    'cuándo',
    'como',
    'cómo',
    'si',
  ]);

  for (let i = 0; i < candidates.length; i++) {
    const t = String(candidates[i]?.title ?? '').trim();
    if (!t) {
      issues.push({ index: i, type: 'missing_title' });
      continue;
    }
    if (t.length > maxLen) {
      issues.push({ index: i, type: 'title_too_long', length: t.length, maxLen, title: t });
    }

    const first = t
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .split(/\s+/)[0]
      .toLowerCase();
    if (first && !starters.has(first)) {
      issues.push({ index: i, type: 'title_starter_not_question_word', title: t });
    }
  }
  return issues;
}

async function listJsonFilesByMtimeDesc(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json'))
      .map((e) => path.join(dirPath, e.name));

    const withStat = await Promise.all(
      files.map(async (fp) => {
        const st = await fs.stat(fp);
        return { fp, mtimeMs: st.mtimeMs };
      })
    );

    return withStat.sort((a, b) => b.mtimeMs - a.mtimeMs).map((x) => x.fp);
  } catch (error) {
    if (error && error.code === 'ENOENT') return [];
    throw error;
  }
}

async function ask(rl, question, { defaultValue = '' } = {}) {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  const raw = await rl.question(`${question}${suffix}: `);
  const v = String(raw ?? '').trim();
  return v || defaultValue;
}

async function askChoice(rl, question, choices) {
  for (const c of choices) {
    console.log(`  ${c.key}) ${c.label}`);
  }
  const keySet = new Set(choices.map((c) => String(c.key)));
  while (true) {
    const v = await ask(rl, question, { defaultValue: String(choices[0]?.key ?? '') });
    if (keySet.has(String(v))) return String(v);
    console.log('Opción inválida.');
  }
}

async function main() {
  console.log(`\n🚀 Iniciando generador de artículos`);
  console.log(`📡 Proveedor: ${config.provider}`);
  console.log(`📄 Formato: ${config.outputFormat}\n`);

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const toolRootDir = path.resolve(scriptDir, '..');

  const resolveFromToolRoot = (p) => (path.isAbsolute(p) ? p : path.resolve(toolRootDir, p));
  const resolveDirFromCwdOrToolRoot = async (p) => {
    const cwdResolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    if (await fileExists(cwdResolved)) return cwdResolved;
    return resolveFromToolRoot(p);
  };

  const promptsDirResolved = await resolveDirFromCwdOrToolRoot(config.promptsDir);
  const infoDirResolved = await resolveDirFromCwdOrToolRoot('./informacion-txt');
  const formatterDirResolved = await resolveDirFromCwdOrToolRoot('./ejemplo-fromater');
  const outDirResolved = resolveFromToolRoot('./out');

  const promptReader = new PromptReader(promptsDirResolved);

  try {
    const argv = process.argv.slice(2);
    const args = parseArgs(argv);
    const command = args._[0] || '';
    const targetPath = args._[0] && !['analyze', 'generate-plan'].includes(args._[0]) ? args._[0] : args._[1];

    console.log('  📖 Leyendo instrucciones globales (prompts/promts.txt)...');
    const promptFile = args.prompt
      ? path.resolve(String(args.prompt))
      : path.join(promptsDirResolved, 'promts.txt');
    const globalInstructions = await readRequiredFile(promptFile, `prompts/${path.basename(promptFile)}`);

    const outputDirFromPrompt = extractOutputDirFromGlobalInstructions(globalInstructions);
    const outDirOverride = args.outDir ? path.resolve(String(args.outDir)) : '';
    const fileGenerator = new FileGenerator(outDirOverride || outputDirFromPrompt || config.outputDir);

    console.log('  📖 Leyendo ejemplos de formato (ejemplo-fromater)...');
    const formatterExamples = await readAllFilesInDir(formatterDirResolved);

    const getAIClient = () => new AIClient();

    if (argv.length === 0) {
      const rl = readline.createInterface({ input: stdinInput, output: stdoutOutput });
      try {
        const choice = await askChoice(rl, 'Selecciona una opción', [
          { key: '1', label: 'Analizar artículo (.md) y guardar investigación (JSON) en /out' },
          { key: '2', label: 'Generar artículos desde una investigación (JSON) en /out' },
          { key: '0', label: 'Salir' },
        ]);

        if (choice === '0') return;

        if (choice === '1') {
          const lang = await askChoice(rl, 'Idioma del artículo', [
            { key: 'es', label: 'Español' },
            { key: 'en', label: 'English' },
          ]);

          const mdOutDir = await ask(rl, 'Directorio donde se guardarán los .md', {
            defaultValue: outputDirFromPrompt || config.outputDir,
          });

          const inputPathRaw = await ask(rl, 'Ruta del artículo a investigar (.md)', {
            defaultValue: 'src/content/blog/como-posicionar-mi-web-en-los-primeros-lugares-de-google.md',
          });
          const inputPath = path.resolve(inputPathRaw);

          const slug = path.basename(inputPath).replace(/\.(md|mdx)$/i, '');
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          const outputPath = path.join(outDirResolved, `analysis-${slug}-${stamp}.json`);

          await fs.mkdir(outDirResolved, { recursive: true });

          const maxTitleLen = 72;
          const repoRoot = (await findRepoRoot(process.cwd())) ?? process.cwd();
          const existingPosts = await summarizeExistingBlogPosts(repoRoot);

          console.log(`\n▶ Analizando: ${inputPath}`);
          const sourceContent = await readRequiredFile(inputPath, 'artículo fuente');
          const wc = wordCount(sourceContent);

          const researchContent = JSON.stringify(
            {
              language: lang,
              mdOutputDir: mdOutDir,
              sourceArticle: { path: inputPath, wordCount: wc, md: sourceContent },
              constraints: { maxTitleLength: maxTitleLen },
              existingSitePosts: existingPosts.slice(0, 400),
            },
            null,
            2
          );

          logPromptParts({ globalInstructions, formatterExamples, researchContent });
          console.log('  🤖 Generando análisis/plan...');
          const modelOutput = stripOuterMarkdownCodeFence(await getAIClient().generate(createMessages({ globalInstructions, formatterExamples, researchContent })));

          await fs.writeFile(outputPath, modelOutput, 'utf-8');
          console.log(`  ✅ Investigación guardada: ${outputPath}`);

          const parsed = tryParseJsonFromModelOutput(modelOutput);
          if (parsed.value) {
            const issues = validatePlanTitles(parsed.value, maxTitleLen);
            if (issues.length) {
              console.log(`  ⚠️ Validación: ${issues.length} título(s) fuera de regla (max ${maxTitleLen})`);
            }
          }

          const go = await ask(rl, '¿Generar artículos ahora desde este JSON? (s/n)', { defaultValue: 'n' });
          if (go.toLowerCase() !== 's') return;

          args.plan = outputPath;
          args.outDir = mdOutDir;
        }

        if (choice === '2') {
          const lang = await askChoice(rl, 'Idioma del artículo', [
            { key: 'es', label: 'Español' },
            { key: 'en', label: 'English' },
          ]);
          args.lang = lang;

          const files = await listJsonFilesByMtimeDesc(outDirResolved);
          if (files.length === 0) {
            throw new Error(`No hay archivos .json en ${outDirResolved}`);
          }

          console.log(`\n📂 Investigaciones encontradas en /out:\n`);
          for (let i = 0; i < files.length; i++) {
            console.log(`  ${i + 1}) ${path.basename(files[i])}`);
          }

          const idxRaw = await ask(rl, 'Selecciona el número del JSON', { defaultValue: '1' });
          const idx = Math.max(1, Math.min(files.length, parseInt(idxRaw, 10) || 1));
          args.plan = files[idx - 1];

          const mdOutDir = await ask(rl, 'Directorio donde se guardarán los .md', {
            defaultValue: outputDirFromPrompt || config.outputDir,
          });
          args.outDir = mdOutDir;
        }
      } finally {
        rl.close();
      }
    }

    if (command === 'analyze') {
      const inputPath = args.input ? path.resolve(String(args.input)) : null;
      if (!inputPath) {
        throw new Error('Falta --input con la ruta del artículo .md a analizar');
      }
      const outputPath = args.output
        ? path.resolve(String(args.output))
        : path.resolve(outDirResolved, `analysis-${path.basename(inputPath).replace(/\.(md|mdx)$/i, '')}.json`);
      const maxTitleLen = Number.isFinite(Number(args.maxTitleLen)) ? Number(args.maxTitleLen) : 72;

      const repoRoot = (await findRepoRoot(process.cwd())) ?? process.cwd();
      const existingPosts = await summarizeExistingBlogPosts(repoRoot);

      console.log(`\n▶ Analizando: ${inputPath}`);
      const sourceContent = await readRequiredFile(inputPath, 'artículo fuente');
      const wc = wordCount(sourceContent);

      const researchContent = JSON.stringify(
        {
          language: args.lang ? String(args.lang) : '',
          mdOutputDir: outDirOverride || outputDirFromPrompt || config.outputDir,
          sourceArticle: {
            path: inputPath,
            wordCount: wc,
            md: sourceContent,
          },
          constraints: {
            maxTitleLength: maxTitleLen,
            singleTagForAllNewArticles: args.tag ? String(args.tag).trim() : '',
            draft: typeof args.draft !== 'undefined' ? String(args.draft) : '',
          },
          existingSitePosts: existingPosts.slice(0, 400),
        },
        null,
        2
      );
      logPromptParts({ globalInstructions, formatterExamples, researchContent });

      console.log('  🤖 Generando análisis/plan...');
      const messages = createMessages({ globalInstructions, formatterExamples, researchContent });
      const modelOutput = stripOuterMarkdownCodeFence(await getAIClient().generate(messages));

      console.log('  💾 Guardando plan...');
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, modelOutput, 'utf-8');
      console.log(`  ✅ Plan guardado: ${outputPath}`);

      const parsed = tryParseJsonFromModelOutput(modelOutput);
      if (parsed.value) {
        const issues = validatePlanTitles(parsed.value, maxTitleLen);
        if (issues.length) {
          console.log(`  ⚠️ Validación: ${issues.length} título(s) fuera de regla (max ${maxTitleLen})`);
        }
      } else {
        console.log('  ⚠️ No pude validar títulos: el plan no parece JSON válido');
      }

      console.log('\n✨ Proceso completado\n');
      return;
    }

    if (command === 'generate-plan' || args.plan) {
      const planPath = args.plan ? path.resolve(String(args.plan)) : null;
      if (!planPath) {
        throw new Error('Falta --plan con la ruta del archivo JSON del plan');
      }
      const planRaw = await readRequiredFile(planPath, 'plan JSON');
      const parsed = tryParseJsonFromModelOutput(planRaw);
      if (!parsed.value) {
        throw new Error(`Plan no es JSON válido: ${parsed.error?.message || 'error'}`);
      }

      const plan = parsed.value;
      const articles = Array.isArray(plan) ? plan : Array.isArray(plan?.articles) ? plan.articles : [];
      if (!Array.isArray(articles) || articles.length === 0) {
        throw new Error('El plan no contiene artículos (esperado: array o { "articles": [...] })');
      }

      const planMdOutputDir =
        typeof plan?.mdOutputDir === 'string' && plan.mdOutputDir.trim()
          ? plan.mdOutputDir.trim()
          : typeof plan?.constraints?.mdOutputDir === 'string' && plan.constraints.mdOutputDir.trim()
            ? plan.constraints.mdOutputDir.trim()
            : '';
      const mdOutDirFinal = outDirOverride || planMdOutputDir || outputDirFromPrompt || config.outputDir;

      console.log(`\n📂 Plan cargado: ${articles.length} artículo(s)\n`);

      for (let i = 0; i < articles.length; i++) {
        const item = articles[i];
        const desiredTitle = String(item?.title ?? '').trim();
        const baseName = desiredTitle ? slugifyFilename(desiredTitle) : `articulo-${i + 1}`;

        console.log(`\n▶ Generando (${i + 1}/${articles.length}): ${desiredTitle || baseName}`);
        const researchContent = JSON.stringify(
          {
            planPath,
            item,
            language: args.lang ? String(args.lang) : '',
            mdOutputDir: mdOutDirFinal,
          },
          null,
          2
        );

        logPromptParts({ globalInstructions, formatterExamples, researchContent });

        console.log('  🤖 Generando artículo...');
        const messages = createMessages({ globalInstructions, formatterExamples, researchContent });
        const article = enforceTitle(
          sanitizeForMdx(stripOuterMarkdownCodeFence(await getAIClient().generate(messages))),
          desiredTitle
        );

        console.log('  💾 Guardando archivo...');
        const perRunFileGenerator = mdOutDirFinal === fileGenerator.outputDir ? fileGenerator : new FileGenerator(mdOutDirFinal);
        const outputPath = await perRunFileGenerator.save(article, baseName);
        console.log(`  ✅ Guardado: ${outputPath}`);
      }

      console.log('\n✨ Proceso completado\n');
      return;
    }

    if (!targetPath) {
      const researchFiles = await listTxtFilesInDir(infoDirResolved);
      if (researchFiles.length === 0) {
        throw new Error(`No hay archivos .txt en ${infoDirResolved}`);
      }

      console.log(`\n📂 Encontrados ${researchFiles.length} archivos en informacion-txt\n`);

      for (const researchFile of researchFiles) {
        console.log(`\n▶ Investigación: ${researchFile}`);
        console.log('  📖 Leyendo investigación...');
        const researchContent = await promptReader.readPrompt(researchFile);

        const baseNameFromFile = promptReader.extractFilename(researchFile);
        const desiredTitle = extractSeoTitleFromResearchContent(researchContent) || extractFirstNonEmptyLine(researchContent);
        const baseName = desiredTitle ? slugifyFilename(desiredTitle) : baseNameFromFile;

        logPromptParts({ globalInstructions, formatterExamples, researchContent });

        console.log('  🤖 Generando artículo...');
        const messages = createMessages({ globalInstructions, formatterExamples, researchContent });
        const article = enforceTitle(
          sanitizeForMdx(stripOuterMarkdownCodeFence(await getAIClient().generate(messages))),
          desiredTitle
        );

        console.log('  💾 Guardando archivo...');
        const outputPath = await fileGenerator.save(article, baseName);
        console.log(`  ✅ Guardado: ${outputPath}`);
      }
    } else {
      const promptFiles = await promptReader.resolveTargetFiles(targetPath);

      if (promptFiles.length === 0) {
        console.log('❌ No hay archivos .txt para procesar');
        return;
      }

      console.log(`📂 Encontrados ${promptFiles.length} prompts\n`);

      for (const promptFile of promptFiles) {
        console.log(`\n▶ Procesando: ${promptFile}`);

        try {
          console.log('  📖 Leyendo contenido...');
          const researchContent = await promptReader.readPrompt(promptFile);

          const baseNameFromFile = promptReader.extractFilename(promptFile);
          const desiredTitle = extractSeoTitleFromResearchContent(researchContent) || extractFirstNonEmptyLine(researchContent);
          const baseName = desiredTitle ? slugifyFilename(desiredTitle) : baseNameFromFile;

          logPromptParts({ globalInstructions, formatterExamples, researchContent });

          console.log('  🤖 Generando artículo...');
          const messages = createMessages({ globalInstructions, formatterExamples, researchContent });
          const article = enforceTitle(
            sanitizeForMdx(stripOuterMarkdownCodeFence(await getAIClient().generate(messages))),
            desiredTitle
          );

          console.log('  💾 Guardando archivo...');
          const outputPath = await fileGenerator.save(article, baseName);

          console.log(`  ✅ Guardado: ${outputPath}`);
        } catch (error) {
          console.error(`  ❌ Error: ${error.message}`);
        }
      }
    }

    console.log('\n✨ Proceso completado\n');
  } catch (error) {
    console.error(`\n❌ Error fatal: ${error.message}\n`);
    process.exit(1);
  }
}

const isExecutedDirectly = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isExecutedDirectly) {
  main();
}
