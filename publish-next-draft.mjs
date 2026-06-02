import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000;

function bogotaYmdFromMs(ms) {
	const d = new Date(Number(ms) + BOGOTA_OFFSET_MS);
	return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

function parsePubDateYmd(value) {
	const raw = String(value ?? '').trim();
	if (!raw) return null;

	const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (m) return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };

	const date = new Date(raw);
	if (Number.isNaN(date.valueOf())) return null;
	return bogotaYmdFromMs(date.valueOf());
}

function sameYmd(a, b) {
	if (!a || !b) return false;
	return a.y === b.y && a.m === b.m && a.d === b.d;
}

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
	const original = String(markdown ?? '');
	const text = original.replace(/\r\n/g, '\n');
	if (!text.startsWith('---')) return null;

	const endMatch = text.match(/\n---\s*(?:\n|$)/);
	if (!endMatch || typeof endMatch.index !== 'number') return null;

	const endIdx = endMatch.index;
	const body = text.slice(3, endIdx).replace(/^\n/, '').trimEnd();
	const rest = text.slice(endIdx + endMatch[0].length);
	return { body, rest };
}

function extractField(frontmatterBody, key) {
	const re = new RegExp(`^\\s*${key}\\s*:\\s*(.+)\\s*$`, 'im');
	const m = String(frontmatterBody ?? '').match(re);
	if (!m) return '';
	const raw = String(m[1] ?? '').trim();
	return raw.replace(/^['"]|['"]$/g, '').trim();
}

function setDraftFalse(markdown) {
	const fm = parseFrontmatter(markdown);
	if (!fm) return { changed: false, markdown };

	const lines = fm.body.split(/\r?\n/);
	let changed = false;
	let found = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i] ?? '';
		const m = line.match(/^(\s*)draft\s*:\s*(true|false)\b/i);
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

	const newFrontmatter = `---\n${lines.join('\n')}\n---\n`;
	const rebuilt = `${newFrontmatter}${fm.rest}`;
	return { changed: true, markdown: rebuilt };
}

async function main() {
	if (!(await fileExists(BLOG_DIR))) {
		console.log(`No existe el directorio: ${BLOG_DIR}`);
		return;
	}

	const files = await listFilesRecursive(BLOG_DIR);
	const today = bogotaYmdFromMs(Date.now());

	const candidates = [];
	let skippedNoPubDate = 0;
	let skippedOtherDay = 0;
	for (const fp of files) {
		const raw = await fs.readFile(fp, 'utf8');
		const fm = parseFrontmatter(raw);
		if (!fm) continue;

		const draftRaw = extractField(fm.body, 'draft');
		if (String(draftRaw).toLowerCase() !== 'true') continue;

		const pubDateRaw = extractField(fm.body, 'pubDate');
		const pubDateYmd = parsePubDateYmd(pubDateRaw);
		if (!pubDateYmd) {
			skippedNoPubDate++;
			continue;
		}

		if (!sameYmd(pubDateYmd, today)) {
			skippedOtherDay++;
			continue;
		}

		candidates.push({ fp });
	}

	candidates.sort((a, b) => a.fp.localeCompare(b.fp));

	if (candidates.length === 0) {
		console.log(
			`No hay artículos con draft: true para publicar hoy (America/Bogota). (${skippedOtherDay} con pubDate de otro día, ${skippedNoPubDate} sin pubDate)`,
		);
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
