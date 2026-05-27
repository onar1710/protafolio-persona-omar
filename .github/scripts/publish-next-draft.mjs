import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

async function fileExists(fp) {
	try {
		await fs.access(fp);
		return true;
	} catch {
		return false;
	}
}

async function listFilesRecursive(dirPath) {
	const out = [];
	const stack = [dirPath];
	while (stack.length) {
		const current = stack.pop();
		const entries = await fs.readdir(current, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(current, e.name);
			if (e.isDirectory()) {
				stack.push(full);
				continue;
			}
			if (!e.isFile()) continue;
			if (!/\.(md|mdx)$/i.test(e.name)) continue;
			out.push(full);
		}
	}
	out.sort((a, b) => a.localeCompare(b));
	return out;
}

function parseFrontmatter(markdown) {
	const text = String(markdown ?? '');
	if (!text.startsWith('---')) return null;
	const endIdx = text.indexOf('\n---', 3);
	if (endIdx === -1) return null;
	const body = text.slice(3, endIdx).replace(/^\r?\n/, '').trimEnd();
	const rest = text.slice(endIdx + '\n---'.length);
	return { body, rest, endIdx };
}

function extractField(frontmatterBody, key) {
	const re = new RegExp(`^\\s*${key}\\s*:\\s*(.+)\\s*$`, 'im');
	const m = String(frontmatterBody ?? '').match(re);
	if (!m) return '';
	const raw = String(m[1] ?? '').trim();
	return raw.replace(/^['"]|['"]$/g, '').trim();
}

function parseDate(value) {
	const raw = String(value ?? '').trim();
	if (!raw) return null;
	const d = new Date(raw);
	if (Number.isNaN(d.valueOf())) return null;
	return d;
}

function setDraftFalse(markdown) {
	const fm = parseFrontmatter(markdown);
	if (!fm) return { changed: false, markdown };

	const lines = fm.body.split(/\r?\n/);
	let changed = false;
	let found = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i] ?? '';
		const m = line.match(/^(\s*)draft\s*:\s*(true|false)\s*$/i);
		if (!m) continue;
		found = true;
		if (String(m[2]).toLowerCase() === 'false') break;
		lines[i] = `${m[1]}draft: false`;
		changed = true;
		break;
	}

	if (!found) {
		lines.unshift('draft: false');
		changed = true;
	}

	if (!changed) return { changed: false, markdown };

	const newFrontmatter = `---\n${lines.join('\n')}\n---`;
	const rebuilt = `${newFrontmatter}${fm.rest}`;
	return { changed: true, markdown: rebuilt };
}

async function main() {
	if (!(await fileExists(BLOG_DIR))) {
		console.log(`No existe el directorio: ${BLOG_DIR}`);
		return;
	}

	const files = await listFilesRecursive(BLOG_DIR);

	const candidates = [];
	for (const fp of files) {
		const raw = await fs.readFile(fp, 'utf8');
		const fm = parseFrontmatter(raw);
		if (!fm) continue;

		const draftRaw = extractField(fm.body, 'draft');
		if (String(draftRaw).toLowerCase() !== 'true') continue;

		const pubDateRaw = extractField(fm.body, 'pubDate');
		const pubDate = parseDate(pubDateRaw);

		candidates.push({ fp, pubDate });
	}

	candidates.sort((a, b) => {
		if (a.pubDate && b.pubDate) {
			const diff = a.pubDate.valueOf() - b.pubDate.valueOf();
			if (diff !== 0) return diff;
		} else if (a.pubDate && !b.pubDate) {
			return -1;
		} else if (!a.pubDate && b.pubDate) {
			return 1;
		}
		return a.fp.localeCompare(b.fp);
	});

	if (candidates.length === 0) {
		console.log('No hay artículos con draft: true para publicar.');
		return;
	}

	const target = candidates[0];
	const rel = path.relative(ROOT, target.fp).replace(/\\/g, '/');
	console.log(`Publicando: ${rel}`);

	const raw = await fs.readFile(target.fp, 'utf8');
	const updated = setDraftFalse(raw);
	if (!updated.changed) {
		console.log('No hubo cambios (ya estaba draft: false).');
		return;
	}

	if (dryRun) {
		console.log('[dry-run] No se escribió ningún archivo.');
		return;
	}

	await fs.writeFile(target.fp, updated.markdown, 'utf8');
	console.log('OK: draft cambiado a false.');
}

main().catch((error) => {
	console.error(`Error: ${error?.message || String(error)}`);
	process.exit(1);
});

