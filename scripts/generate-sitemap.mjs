import fs from 'node:fs';
import path from 'node:path';

const site = 'https://www.omarfuentes.com';
const dist = path.join(process.cwd(), 'dist');

if (!fs.existsSync(dist)) process.exit(0);

const pad2 = (n) => String(n).padStart(2, '0');
const toDate = (ms) => {
	const d = new Date(ms);
	return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
};

const escXml = (value) =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/'/g, '&apos;');

const shouldInclude = (urlPath) => {
	if (urlPath === '/404/' || urlPath === '/404.html') return false;
	if (urlPath.startsWith('/_astro/')) return false;
	if (urlPath === '/rss.xml') return false;
	if (urlPath.endsWith('-web-design/')) return false;

	if (/^\/(aviso-legal|politicas-cookies|politica-cookies|politica-privacidad|terminos-condiciones|terminos)(\/)?$/.test(urlPath)) return false;
	if (/^\/en\/(legal-notice|cookies-policy|privacy-policy|terms-conditions)(\/)?$/.test(urlPath)) return false;
	if (/^\/(contacto|en\/contact)(\/)?$/.test(urlPath)) return false;
	if (/^\/(portfolio\/proyectos|en\/portfolio\/projects|portfolio|en\/portfolio)(\/)?$/.test(urlPath)) return false;

	return true;
};

const changefreqFor = (urlPath) => {
	if (urlPath === '/' || urlPath === '/blog/' || urlPath === '/en/blog/') return 'weekly';
	if (urlPath.startsWith('/blog/') || urlPath.startsWith('/en/blog/')) return 'weekly';

	const legal = new Set([
		'/aviso-legal/',
		'/politica-privacidad/',
		'/politicas-cookies/',
		'/terminos-condiciones/',
		'/en/legal-notice/',
		'/en/privacy-policy/',
		'/en/cookies-policy/',
		'/en/terms-conditions/',
	]);
	if (legal.has(urlPath)) return 'yearly';

	const contact = new Set(['/contacto/', '/en/contact/']);
	if (contact.has(urlPath)) return 'yearly';

	if (
		urlPath.startsWith('/portfolio/') ||
		urlPath.startsWith('/en/portfolio/') ||
		urlPath.startsWith('/herramientas/') ||
		urlPath.startsWith('/en/tools/') ||
		urlPath.endsWith('-web-design/') ||
		urlPath === '/servicios/' ||
		urlPath === '/en/services/' ||
		urlPath === '/sobre-mi/' ||
		urlPath === '/en/about/' ||
		urlPath === '/herramientas/' ||
		urlPath === '/en/tools/'
	)
		return 'monthly';

	return 'monthly';
};

const priorityFor = (urlPath) => {
	if (urlPath === '/') return '1.0';
	if (urlPath === '/blog/' || urlPath === '/en/blog/') return '0.9';
	if (urlPath.startsWith('/blog/') || urlPath.startsWith('/en/blog/')) return '0.8';

	const legal = new Set([
		'/aviso-legal/',
		'/politica-privacidad/',
		'/politicas-cookies/',
		'/terminos-condiciones/',
		'/en/legal-notice/',
		'/en/privacy-policy/',
		'/en/cookies-policy/',
		'/en/terms-conditions/',
	]);
	if (legal.has(urlPath)) return '0.3';

	const contact = new Set(['/contacto/', '/en/contact/']);
	if (contact.has(urlPath)) return '0.3';

	const dedicated = new Set([
		'/servicios/',
		'/en/services/',
		'/sobre-mi/',
		'/en/about/',
		'/portfolio/proyectos/',
		'/en/portfolio/projects/',
		'/herramientas/',
		'/en/tools/',
	]);
	if (dedicated.has(urlPath)) return '0.6';

	if (
		urlPath.startsWith('/portfolio/') ||
		urlPath.startsWith('/en/portfolio/') ||
		urlPath.startsWith('/herramientas/') ||
		urlPath.startsWith('/en/tools/') ||
		urlPath.endsWith('-web-design/')
	)
		return '0.6';

	return '0.3';
};

const walk = (dir) => {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
};

for (const f of fs.readdirSync(dist)) {
	if (/^sitemap(-index)?(-\d+)?\.xml$/i.test(f)) fs.rmSync(path.join(dist, f));
}

const files = walk(dist);
const urls = [];

for (const file of files) {
	const rel = path.relative(dist, file).replace(/\\/g, '/');

	if (rel === 'sitemap.xml') continue;
	if (rel === 'robots.txt') continue;

	if (rel.endsWith('.html')) {
		if (rel.endsWith('/index.html') || rel === 'index.html') {
			const dir = rel === 'index.html' ? '' : rel.slice(0, -'/index.html'.length);
			const urlPath = dir ? `/${dir}/` : '/';
			if (!shouldInclude(urlPath)) continue;
			const stat = fs.statSync(file);
			urls.push({
				urlPath,
				lastmod: toDate(stat.mtimeMs),
				priority: priorityFor(urlPath),
				changefreq: changefreqFor(urlPath),
			});
		}
		continue;
	}

	if (rel === 'rss.xml') continue;
}

const seen = new Set();
const uniq = [];
for (const u of urls.sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
	if (seen.has(u.urlPath)) continue;
	seen.add(u.urlPath);
	uniq.push(u);
}

const xml = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	...uniq.map(
		(u) =>
			`  <url>\n    <loc>${escXml(site + u.urlPath)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
	),
	'</urlset>',
	'',
].join('\n');

fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml, 'utf-8');
