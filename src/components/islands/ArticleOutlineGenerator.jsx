import React, { useEffect, useMemo, useRef, useState } from 'react';

function normalizeRelatedKeywords(value) {
  return value
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

function downloadTextFile({ filename, content }) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ArticleOutlineGenerator({ lang = 'es', apiPath = '/api/generar-estructura-articulo' }) {
  const labels = useMemo(() => {
    if (lang === 'en') {
      return {
        title: 'Free AI Article Outline Generator',
        subtitle: 'Generate a complete SEO-focused article structure (H2/H3, FAQ, tables, and more).',
        mainKeyword: 'Main keyword',
        relatedKeywords: 'Related keywords (comma separated)',
        competitorData: 'Competitor data (optional)',
        competitorHelp:
          'Paste notes, People Also Ask, snippets, or a JSON summary. The more context, the better the outline.',
        generate: 'Generate outline',
        generating: 'Generating...',
        output: 'Output',
        copy: 'Copy',
        download: 'Download .md',
        reset: 'Reset',
        copied: 'Copied',
        errorMissing: 'Please enter a main keyword.',
        errorApi: 'Could not generate the outline. Try again.',
      };
    }

    return {
      title: 'Generador AI de Estructura de Artículos',
      subtitle: 'Genera una estructura completa enfocada en SEO (H2/H3, FAQ, tablas y más).',
      mainKeyword: 'Palabra clave principal',
      relatedKeywords: 'Palabras clave relacionadas (separadas por coma)',
      competitorData: 'Datos de competencia (opcional)',
      competitorHelp:
        'Pega notas, People Also Ask, snippets o un resumen en JSON. Entre más contexto, mejor la estructura.',
      generate: 'Generar estructura',
      generating: 'Generando...',
      output: 'Resultado',
      copy: 'Copiar',
      download: 'Descargar .md',
      reset: 'Limpiar',
      copied: 'Copiado',
      errorMissing: 'Escribe una palabra clave principal.',
      errorApi: 'No se pudo generar la estructura. Intenta de nuevo.',
    };
  }, [lang]);

  const [mainKeyword, setMainKeyword] = useState('');
  const [relatedKeywordsRaw, setRelatedKeywordsRaw] = useState('');
  const [competitorData, setCompetitorData] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outline, setOutline] = useState('');
  const [copied, setCopied] = useState(false);

  const turnstileSiteKey = typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_TURNSTILE_SITE_KEY : undefined;
  const shouldUseTurnstile = Boolean(turnstileSiteKey) && typeof import.meta !== 'undefined' && !import.meta.env?.DEV;
  const turnstileRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (!shouldUseTurnstile) return;
    if (!turnstileRef.current) return;

    const ensureScript = () => {
      if (document.querySelector('script[data-turnstile-script="true"]')) return;
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.dataset.turnstileScript = 'true';
      document.head.appendChild(s);
    };

    ensureScript();

    const tryRender = () => {
      if (!window.turnstile) return false;
      if (turnstileWidgetIdRef.current !== null) return true;

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => setTurnstileToken(String(token || '')),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
      return true;
    };

    const iv = window.setInterval(() => {
      const ok = tryRender();
      if (ok) window.clearInterval(iv);
    }, 250);

    return () => {
      window.clearInterval(iv);
      if (window.turnstile && turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [shouldUseTurnstile]);

  async function onGenerate(e) {
    e.preventDefault();
    setCopied(false);
    setError('');

    const mk = mainKeyword.trim();
    if (!mk) {
      setError(labels.errorMissing);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          mainKeyword: mk,
          relatedKeywords: normalizeRelatedKeywords(relatedKeywordsRaw),
          competitorData: competitorData.trim(),
          turnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const serverMsg = typeof data?.error === 'string' ? data.error : '';
        const detailsMsg = typeof data?.details === 'string' ? data.details : '';
        setError(detailsMsg || serverMsg || labels.errorApi);
        return;
      }

      if (!data?.outline) {
        setError(labels.errorApi);
        return;
      }

      setOutline(String(data.outline));
    } catch {
      setError(labels.errorApi);
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!outline) return;
    try {
      await navigator.clipboard.writeText(outline);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function onDownload() {
    if (!outline) return;
    const safe = (mainKeyword || 'outline').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    downloadTextFile({
      filename: `outline-${safe || 'article'}.md`,
      content: outline,
    });
  }

  function onReset() {
    setMainKeyword('');
    setRelatedKeywordsRaw('');
    setCompetitorData('');
    setOutline('');
    setError('');
    setCopied(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 md:pt-40 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{labels.title}</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={onGenerate} className="rounded-2xl border border-black/10 bg-white text-black shadow-sm overflow-hidden">
          <div className="bg-[#2f30f7] text-white px-5 py-4">
            <h2 className="text-lg font-semibold">{lang === 'en' ? 'Inputs' : 'Datos'}</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">{labels.mainKeyword}</label>
              <input
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={mainKeyword}
                onChange={(e) => setMainKeyword(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. local seo services for small business' : 'ej: servicios seo local para pequeñas empresas'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{labels.relatedKeywords}</label>
              <input
                className="w-full rounded-xl border border-black/20 bg-white px-4 py-3"
                value={relatedKeywordsRaw}
                onChange={(e) => setRelatedKeywordsRaw(e.target.value)}
                placeholder={lang === 'en' ? 'keyword 1, keyword 2, keyword 3' : 'keyword 1, keyword 2, keyword 3'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{labels.competitorData}</label>
              <textarea
                className="w-full min-h-40 rounded-xl border border-black/20 bg-white px-4 py-3"
                value={competitorData}
                onChange={(e) => setCompetitorData(e.target.value)}
                placeholder={lang === 'en' ? 'Paste competitor notes or JSON here...' : 'Pega notas o JSON aquí...'}
              />
              <p className="text-xs text-muted-foreground mt-2">{labels.competitorHelp}</p>
            </div>

            {shouldUseTurnstile ? (
              <div>
                <div ref={turnstileRef} />
              </div>
            ) : null}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-primary text-black px-6 py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? labels.generating : labels.generate}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center rounded-full border border-black/20 px-6 py-3 font-semibold hover:bg-black/[0.03] transition-colors"
              >
                {labels.reset}
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-2xl border border-black/10 bg-white text-black shadow-sm overflow-hidden">
          <div className="bg-[#2f30f7] text-white px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold">{labels.output}</h2>
              <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onCopy}
                disabled={!outline}
                aria-label={lang === 'en' ? 'Copy outline to clipboard' : 'Copiar resultado al portapapeles'}
                title={lang === 'en' ? 'Copy to clipboard' : 'Copiar'}
                className="px-3 py-2 sm:px-4 rounded-full text-sm font-semibold border border-white/60 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f30f7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? labels.copied : labels.copy}
              </button>
              <button
                type="button"
                onClick={onDownload}
                disabled={!outline}
                aria-label={lang === 'en' ? 'Download outline as a markdown file' : 'Descargar resultado como archivo markdown'}
                title={lang === 'en' ? 'Download .md' : 'Descargar .md'}
                className="px-3 py-2 sm:px-4 rounded-full text-sm font-semibold border border-white/60 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f30f7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {labels.download}
              </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <textarea
              readOnly
              className="w-full min-h-[420px] rounded-xl border border-black/20 bg-white px-4 py-3 font-mono text-sm"
              value={outline}
              placeholder={lang === 'en' ? 'Your generated outline will appear here...' : 'Aquí aparecerá tu estructura generada...'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
