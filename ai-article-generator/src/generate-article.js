import { AIClient } from './ai-client.js';
import { FileGenerator } from './file-generator.js';

function ensureString(name, value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} es requerido`);
  }
}

export function applyTagToGlobalInstructions(globalInstructions, tag) {
  if (!tag) return globalInstructions;
  const cleanTag = String(tag).trim();
  if (!cleanTag) return globalInstructions;

  const lines = String(globalInstructions ?? '').split(/\r?\n/);
  const tagLineRe = /^\s*\*?etiqueta\s*:\s*\[.*\]/i;
  let replaced = false;

  const updated = lines.map((line) => {
    if (!replaced && tagLineRe.test(line)) {
      replaced = true;
      return `*etiqueta : ["${cleanTag}"]  colocala una sola etiqueta la que te estoy dando`;
    }
    return line;
  });

  if (!replaced) {
    updated.push('');
    updated.push(`*etiqueta : ["${cleanTag}"]  colocala una sola etiqueta la que te estoy dando`);
  }

  return updated.join('\n');
}

function enforceTitle(article, desiredTitle) {
  if (!article || !desiredTitle) return article;
  const title = String(desiredTitle).trim();
  if (!title) return article;

  return String(article).replace(
    /^---\s*\r?\n([\s\S]*?)\r?\n---/,
    (full, body) => {
      const escaped = title.replace(/"/g, '\\"');
      const hasTitle = /^\s*title\s*:/im.test(body);
      const newBody = hasTitle
        ? body.replace(/^\s*title\s*:\s*.*$/im, `title: "${escaped}"`)
        : `title: "${escaped}"\n${body}`;
      return `---\n${newBody}\n---`;
    }
  );
}

export async function generateArticleToFile({
  globalInstructions,
  formatterExamples,
  researchContent,
  outputDir,
  baseName,
  tag,
  desiredTitle
}) {
  ensureString('globalInstructions', globalInstructions);
  ensureString('researchContent', researchContent);
  ensureString('outputDir', outputDir);
  ensureString('baseName', baseName);

  const finalInstructions = applyTagToGlobalInstructions(globalInstructions, tag);

  const aiClient = new AIClient();
  const fileGenerator = new FileGenerator(outputDir);

  const messages = [
    { role: 'system', content: finalInstructions },
    {
      role: 'user',
      content: JSON.stringify(
        {
          formatterExamples: formatterExamples ?? '',
          input: researchContent ?? '',
        },
        null,
        2
      )
    }
  ];

  let article = await aiClient.generate(messages);
  const trimmed = article.trim();
  const fenceMatch = trimmed.match(/^```(?:\w+)?\s*\r?\n([\s\S]*?)\r?\n```\s*$/);
  if (fenceMatch) {
    article = (fenceMatch[1] ?? '').trim() + '\n';
  }

  article = article.replace(/<(?=\s*\d)/g, '&lt;');

  article = enforceTitle(article, desiredTitle);
  const outputPath = await fileGenerator.save(article, baseName);

  return { outputPath };
}
