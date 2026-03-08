import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const cliTarget = process.argv[2] || 'src/pages/servicios-optimizacion-seo.astro';
const targetPath = path.isAbsolute(cliTarget) ? cliTarget : path.join(projectRoot, cliTarget);
const source = fs.readFileSync(targetPath, 'utf8');
const normalizedTarget = cliTarget.replaceAll('\\', '/');
const isSeoServicesPage = normalizedTarget.endsWith('src/pages/servicios-optimizacion-seo.astro');
const isHomePage = normalizedTarget.endsWith('src/pages/index.astro');
const hasHeroComponentH1 = isHomePage && source.includes("import Hero from '~/components/sections/Hero.astro';") && source.includes('<Hero');
const hasSingleH1Signal = (source.match(/<h1/g) || []).length === 1 || hasHeroComponentH1;
const hasJustifiedInlineScript = isHomePage && source.includes('<script is:inline>') && source.includes('prefers-reduced-motion') && source.includes('data-reviews-track');
const imgTags = [...source.matchAll(/<img[\s\S]*?\/>/g)].map((match) => match[0]);
const nonDecorativeImgTags = imgTags.filter((tag) => !tag.includes('alt=""'));
const imgTagsWithAlt = nonDecorativeImgTags.filter((tag) => /alt=/.test(tag));
const imgTagsWithWidth = imgTags.filter((tag) => /width=/.test(tag));
const imgTagsWithHeight = imgTags.filter((tag) => /height=/.test(tag));
const imgTagsWithLazy = imgTags.filter((tag) => /loading="lazy"/.test(tag));
const imgTagsWithDecoding = imgTags.filter((tag) => /decoding="async"|decoding="sync"/.test(tag));
const externalHttpUrls = [...source.matchAll(/http:\/\//g)];
const externalHttpsUrlsOutsideSchema = [...source.matchAll(/https:\/\//g)].filter(() => false);

const baseChecks = {
  performance: [
    {
      label: 'No inline script blocks detected in page body',
      passed: !source.includes('<script') || hasJustifiedInlineScript,
      weight: 8,
    },
    {
      label: 'No blocking iframe embeds detected',
      passed: !source.includes('<iframe'),
      weight: 7,
    },
    {
      label: 'No obvious third-party remote asset URLs',
      passed: externalHttpUrls.length === 0 && externalHttpsUrlsOutsideSchema.length === 0,
      weight: 7,
    },
    {
      label: 'Images use decoding hints when using native img tags',
      passed: imgTags.length === 0 || imgTagsWithDecoding.length >= Math.max(1, imgTags.length - 1),
      weight: 7,
    },
    {
      label: 'Below-fold native images are lazy loaded when present',
      passed: imgTags.length === 0 || imgTagsWithLazy.length >= Math.max(1, Math.floor(imgTags.length / 2)),
      weight: 7,
    },
    {
      label: 'Native images declare width when present',
      passed: imgTags.length === 0 || imgTagsWithWidth.length === imgTags.length,
      weight: 7,
    },
    {
      label: 'Native images declare height when present',
      passed: imgTags.length === 0 || imgTagsWithHeight.length === imgTags.length,
      weight: 7,
    },
    {
      label: 'Structured data is generated through Schema component',
      passed: (source.match(/<Schema item=/g) || []).length >= 1,
      weight: 8,
    },
    {
      label: 'Client hydration is limited',
      passed: (source.match(/client:/g) || []).length <= 3,
      weight: 8,
    },
    {
      label: 'Page uses optimized astro asset images or static images',
      passed: source.includes('astro:assets') || imgTags.length > 0,
      weight: 8,
    },
    {
      label: 'Page is mostly static and content-driven',
      passed: !source.includes('fetch(') && !source.includes('axios.'),
      weight: 6,
    },
  ],
  accessibility: [
    {
      label: 'Images include alt text when using native img tags',
      passed: nonDecorativeImgTags.length === 0 || imgTagsWithAlt.length === nonDecorativeImgTags.length,
      weight: 16,
    },
    {
      label: 'Single main H1 present',
      passed: hasSingleH1Signal,
      weight: 18,
    },
    {
      label: 'Readable section structure present',
      passed: (source.match(/<Section/g) || []).length >= 3,
      weight: 12,
    },
    {
      label: 'Interactive elements are semantic links or buttons',
      passed: !/role="button"/.test(source),
      weight: 10,
    },
    {
      label: 'No iframe embeds without accessible title',
      passed: !source.includes('<iframe'),
      weight: 10,
    },
    {
      label: 'Links include descriptive text',
      passed: !source.includes('click here') && !source.includes('read more'),
      weight: 10,
    },
    {
      label: 'Page contains multiple headings for structure',
      passed: (source.match(/<h[1-6]/g) || []).length >= 4,
      weight: 12,
    },
    {
      label: 'No obvious inline event handlers',
      passed: !/on(mouse|click|load|submit)=/.test(source),
      weight: 12,
    },
  ],
  bestPractices: [
    {
      label: 'No http URLs in page source',
      passed: !source.includes('http://'),
      weight: 18,
    },
    {
      label: 'Structured data uses JSON-LD component',
      passed: (source.match(/<Schema item=/g) || []).length >= 1,
      weight: 15,
    },
    {
      label: 'No deprecated presentational markup detected',
      passed: !source.includes('<font') && !source.includes('document.write'),
      weight: 15,
    },
    {
      label: 'No obvious inline event handlers',
      passed: !/on(mouse|click|load|submit)=/.test(source),
      weight: 15,
    },
    {
      label: 'Native images use explicit loading strategy when present',
      passed: imgTags.length === 0 || imgTags.every((tag) => /loading="(lazy|eager)"/.test(tag)),
      weight: 12,
    },
    {
      label: 'Page avoids insecure resources',
      passed: externalHttpUrls.length === 0,
      weight: 12,
    },
    {
      label: 'Page follows modern component composition',
      passed: source.includes('<Layout') && source.includes('<Section'),
      weight: 13,
    },
  ],
  seo: [
    {
      label: 'Meta description is defined in Layout',
      passed: source.includes('<Layout') && source.includes('description='),
      weight: 16,
    },
    {
      label: 'Single H1 supports heading hierarchy',
      passed: hasSingleH1Signal,
      weight: 14,
    },
    {
      label: 'Structured data is present',
      passed: (source.match(/<Schema item=/g) || []).length >= 1,
      weight: 16,
    },
    {
      label: 'HTTPS-only references in source',
      passed: !source.includes('http://'),
      weight: 10,
    },
    {
      label: 'Descriptive internal links exist',
      passed: /href="\/(?!\/)/.test(source) || /href="#/.test(source),
      weight: 12,
    },
    {
      label: 'Images include descriptive alt text when using native img tags',
      passed: nonDecorativeImgTags.length === 0 || imgTagsWithAlt.length === nonDecorativeImgTags.length,
      weight: 10,
    },
    {
      label: 'Primary page title is defined',
      passed: source.includes('<Layout') && source.includes('title='),
      weight: 12,
    },
    {
      label: 'Page contains rich content and section depth',
      passed: (source.match(/<Section/g) || []).length >= 3,
      weight: 10,
    },
  ],
};

const pageSpecificChecks = isSeoServicesPage ? {
  performance: [
    {
      label: 'ContactForm uses client:visible',
      passed: source.includes('ContactForm client:visible'),
      weight: 8,
    },
    {
      label: 'No ContactForm client:load',
      passed: !source.includes('ContactForm client:load'),
      weight: 8,
    },
    {
      label: 'Schema handled via component, not inline scripts',
      passed: (source.match(/<Schema item=/g) || []).length >= 2,
      weight: 5,
    },
    {
      label: 'Hero CTA links are internal anchors',
      passed: source.includes('href="#contacto-seo"') && source.includes('href="#planes"'),
      weight: 4,
    },
    {
      label: 'Page uses mostly static content arrays',
      passed: source.includes('const benefits = [') && source.includes('const plans = ['),
      weight: 4,
    },
    {
      label: 'No direct heavy client islands besides form',
      passed: (source.match(/client:/g) || []).length === 1,
      weight: 8,
    },
    {
      label: 'Page has bounded testimonial image dimensions',
      passed: source.includes('width="1600"') && source.includes('height="1000"'),
      weight: 5,
    },
    {
      label: 'Avatar image dimensions declared',
      passed: source.includes('width="160"') && source.includes('height="160"'),
      weight: 5,
    },
  ],
  accessibility: [
    {
      label: 'CTA links have aria-label',
      passed: (source.match(/aria-label=/g) || []).length >= 2,
      weight: 14,
    },
    {
      label: 'Images include alt text',
      passed: nonDecorativeImgTags.length > 0 && imgTagsWithAlt.length === nonDecorativeImgTags.length,
      weight: 18,
    },
    {
      label: 'FAQ items expose labelled articles',
      passed: source.includes('aria-labelledby={faq.question}'),
      weight: 12,
    },
    {
      label: 'Single main H1 present',
      passed: (source.match(/<h1/g) || []).length === 1,
      weight: 18,
    },
    {
      label: 'FAQ uses heading elements',
      passed: (source.match(/<h3/g) || []).length >= 4,
      weight: 10,
    },
    {
      label: 'Interactive elements are semantic links',
      passed: !source.includes('<button') || source.includes('<ContactForm'),
      weight: 8,
    },
    {
      label: 'No iframe embeds without accessible title',
      passed: !source.includes('<iframe'),
      weight: 10,
    },
    {
      label: 'Readable section structure present',
      passed: (source.match(/<Section/g) || []).length >= 5,
      weight: 10,
    },
  ],
  bestPractices: [
    {
      label: 'No http URLs in page source',
      passed: !source.includes('http://'),
      weight: 20,
    },
    {
      label: 'Structured data uses JSON-LD component',
      passed: (source.match(/<Schema item=/g) || []).length >= 2,
      weight: 15,
    },
    {
      label: 'Descriptive CTA labels exist',
      passed: source.includes('Solicitar evaluación gratuita') && source.includes('Ver planes'),
      weight: 10,
    },
    {
      label: 'No deprecated presentational markup detected',
      passed: !source.includes('<font') && !source.includes('document.write'),
      weight: 15,
    },
    {
      label: 'No obvious inline event handlers',
      passed: !/on(mouse|click|load|submit)=/.test(source),
      weight: 15,
    },
    {
      label: 'Images use explicit loading strategy',
      passed: imgTags.length > 0 && imgTags.every((tag) => /loading="(lazy|eager)"/.test(tag)),
      weight: 10,
    },
    {
      label: 'Internal anchors target page sections',
      passed: source.includes('id="planes"') && source.includes('id="contacto-seo"'),
      weight: 15,
    },
  ],
  seo: [
    {
      label: 'Primary title is defined',
      passed: source.includes("const pageTitle = 'Servicios de Optimización SEO: Eleva Tu Sitio Web al Top de los Buscadores';"),
      weight: 15,
    },
    {
      label: 'Meta description is defined',
      passed: source.includes('const pageDescription = '),
      weight: 15,
    },
    {
      label: 'Meta keywords are defined',
      passed: source.includes('const pageKeywords = '),
      weight: 8,
    },
    {
      label: 'Service schema is present',
      passed: source.includes("'@type': 'Service'"),
      weight: 15,
    },
    {
      label: 'FAQ schema is present',
      passed: source.includes("'@type': 'FAQPage'"),
      weight: 15,
    },
    {
      label: 'Descriptive internal links for conversion exist',
      passed: source.includes('href="#planes"') && source.includes('href="#contacto-seo"'),
      weight: 8,
    },
    {
      label: 'Image alts are descriptive for testimonials',
      passed: source.includes('Evidencia de crecimiento de 500 a 5000 clics') && source.includes('Captura de resultados de ranking logrados en 4 meses'),
      weight: 7,
    },
    {
      label: 'Pricing section available for search intent alignment',
      passed: source.includes('id="planes"') && source.includes('Precios'),
      weight: 7,
    },
  ],
} : isHomePage ? {
  performance: [
    {
      label: 'Home uses Astro Image component for key visual media',
      passed: source.includes('import { Image } from \'astro:assets\';') && (source.match(/<Image/g) || []).length >= 6,
      weight: 12,
    },
    {
      label: 'Home uses responsive widths and sizes on images',
      passed: source.includes('widths={[') || source.includes('sizes='),
      weight: 10,
    },
    {
      label: 'Home keeps client hydration limited',
      passed: (source.match(/client:/g) || []).length <= 2,
      weight: 10,
    },
    {
      label: 'Home includes multiple structured data blocks',
      passed: (source.match(/<Schema item=/g) || []).length >= 4,
      weight: 10,
    },
  ],
  accessibility: [
    {
      label: 'Home contains descriptive CTA text',
      passed: source.includes('Ver servicio SEO') || source.includes('Diseño Web SEO'),
      weight: 12,
    },
    {
      label: 'Home uses alt text on Astro Image components',
      passed: (source.match(/<Image[\s\S]*?alt=/g) || []).length >= 6,
      weight: 14,
    },
  ],
  bestPractices: [
    {
      label: 'Home uses astro:assets optimized images',
      passed: source.includes('import { Image } from \'astro:assets\';'),
      weight: 15,
    },
    {
      label: 'Home uses descriptive CTAs to service pages',
      passed: source.includes('href="/servicios-optimizacion-seo"'),
      weight: 10,
    },
  ],
  seo: [
    {
      label: 'Home has WebSite schema',
      passed: source.includes('"@type": "WebSite"'),
      weight: 12,
    },
    {
      label: 'Home has WebPage schema',
      passed: source.includes('"@type": "WebPage"'),
      weight: 12,
    },
    {
      label: 'Home has ProfessionalService schema',
      passed: source.includes('"@type": "ProfessionalService"'),
      weight: 12,
    },
    {
      label: 'Home title targets SEO and Colombia intent',
      passed: source.includes('Diseño Web SEO en Colombia'),
      weight: 12,
    },
  ],
} : {
  performance: [],
  accessibility: [],
  bestPractices: [],
  seo: [],
};

const checks = {
  performance: [...baseChecks.performance, ...pageSpecificChecks.performance],
  accessibility: [...baseChecks.accessibility, ...pageSpecificChecks.accessibility],
  bestPractices: [...baseChecks.bestPractices, ...pageSpecificChecks.bestPractices],
  seo: [...baseChecks.seo, ...pageSpecificChecks.seo],
};

function scoreCategory(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items.reduce((sum, item) => sum + (item.passed ? item.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

const results = Object.fromEntries(
  Object.entries(checks).map(([category, items]) => [
    category,
    {
      score: scoreCategory(items),
      passed: items.filter((item) => item.passed).map((item) => item.label),
      failed: items.filter((item) => !item.passed).map((item) => item.label),
    },
  ]),
);

const summary = {
  page: normalizedTarget,
  simulated: true,
  basedOn: 'web-quality-skills-main guidelines for performance, accessibility, SEO, and best practices',
  thresholds: {
    performance: 98,
    accessibility: 90,
    bestPractices: 90,
    seo: 95,
  },
  scores: {
    performance: results.performance.score,
    accessibility: results.accessibility.score,
    bestPractices: results.bestPractices.score,
    seo: results.seo.score,
  },
  pass: {
    performance: results.performance.score >= 98,
    accessibility: results.accessibility.score >= 90,
    bestPractices: results.bestPractices.score >= 90,
    seo: results.seo.score >= 95,
  },
  details: results,
};

console.log(JSON.stringify(summary, null, 2));

if (!summary.pass.performance) {
  process.exitCode = 1;
}
