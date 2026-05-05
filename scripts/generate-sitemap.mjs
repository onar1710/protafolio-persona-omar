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

	return true;
};

const TOP_ARTICLES = 10;

const isBlogIndex = (urlPath) => urlPath === '/blog/' || urlPath === '/en/blog/';
const isArticlePath = (urlPath) =>
	/^\/blog\/[^/]+\/$/.test(urlPath) ||
	/^\/(seo|disenoweb|marketing-digital|social-media)\/[^/]+\/$/.test(urlPath) ||
	/^\/en\/blog\/[^/]+\/$/.test(urlPath) ||
	/^\/en\/(seo|web-design|digital-marketing|social-media)\/[^/]+\/$/.test(urlPath);
const isProjectsPage = (urlPath) => urlPath === '/portfolio/proyectos/' || urlPath === '/en/portfolio/projects/';
const isServicePage = (urlPath) =>
	urlPath === '/servicios/' ||
	urlPath === '/en/services/' ||
	urlPath === '/servicios-optimizacion-seo/' ||
	urlPath === '/en/affordable-seo-services-for-small-business/' ||
	/^\/(en\/)?[^/]+-web-design\/$/.test(urlPath);
const isAboutPage = (urlPath) => urlPath === '/sobre-mi/' || urlPath === '/en/about/';
const isContactPage = (urlPath) => urlPath === '/contacto/' || urlPath === '/en/contact/';

const shouldKeep = (urlPath, topArticles) => {
	if (urlPath === '/' || urlPath === '/en/') return true;
	if (isBlogIndex(urlPath)) return true;
	if (isArticlePath(urlPath)) return topArticles.has(urlPath);
	if (isProjectsPage(urlPath)) return true;
	if (isServicePage(urlPath)) return true;
	if (isAboutPage(urlPath)) return true;
	if (isContactPage(urlPath)) return true;
	return false;
};

const changefreqFor = (urlPath, topArticles) => {
	if (urlPath === '/' || urlPath === '/en/') return 'weekly';
	if (isBlogIndex(urlPath)) return 'weekly';
	if (isArticlePath(urlPath) && topArticles.has(urlPath)) return 'weekly';
	if (isProjectsPage(urlPath)) return 'monthly';
	if (isServicePage(urlPath)) return 'monthly';
	if (isAboutPage(urlPath)) return 'yearly';
	if (isContactPage(urlPath)) return 'yearly';
	return 'monthly';
};

const priorityFor = (urlPath, topArticles) => {
	if (urlPath === '/' || urlPath === '/en/') return '0.9';
	if (isArticlePath(urlPath) && topArticles.has(urlPath)) return '0.9';
	if (isBlogIndex(urlPath)) return '0.8';
	if (isProjectsPage(urlPath)) return '0.8';
	if (isServicePage(urlPath)) return '0.8';
	if (isAboutPage(urlPath)) return '0.8';
	if (isContactPage(urlPath)) return '0.8';
	return '0.6';
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
				lastmodMs: stat.mtimeMs,
				lastmod: toDate(stat.mtimeMs),
			});
		}
		continue;
	}

	if (rel === 'rss.xml') continue;
}

const topArticles = new Set(
	urls
		.filter((u) => isArticlePath(u.urlPath) && !isBlogIndex(u.urlPath))
		.sort((a, b) => b.lastmodMs - a.lastmodMs)
		.slice(0, TOP_ARTICLES)
		.map((u) => u.urlPath)
);

const filtered = urls
	.filter((u) => shouldKeep(u.urlPath, topArticles))
	.map((u) => ({
		urlPath: u.urlPath,
		lastmod: u.lastmod,
		changefreq: changefreqFor(u.urlPath, topArticles),
		priority: priorityFor(u.urlPath, topArticles),
	}));

const seen = new Set();
const uniq = [];
for (const u of filtered.sort((a, b) => a.urlPath.localeCompare(b.urlPath))) {
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
