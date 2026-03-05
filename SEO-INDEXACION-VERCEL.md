---
# SEO / Indexación (Google Search Console) — Fix "Descubierta: actualmente sin indexar" (Astro + Vercel)

## Objetivo
Resolver el estado de Search Console **"Descubierta: actualmente sin indexar"** en páginas y posts (Blog/Portfolio) asegurando:
- Las URLs existan y respondan **200** (no 404/soft-404).
- Google pueda **leer el sitemap** correctamente.
- `robots.txt` no bloquee el rastreo.
- El **dominio canónico** sea consistente (`www` vs sin `www`).

> Nota: "Descubierta" significa que Google conoce la URL, pero todavía no la ha rastreado o no la prioriza. Un sitemap roto, dominio duplicado o rutas mal generadas suelen provocar este síntoma.

---

## 1) Vercel: build correcto (adapter)
### Cambio aplicado
En `package.json` se ajustó el build por defecto para Vercel:
- `build` -> `npm run build:vercel`
- `build:vercel` usa `ADAPTER=vercel`

### Por qué
Si Vercel construye con el adapter equivocado, pueden quedar:
- rutas no generadas
- HTML inconsistente
- sitemaps faltantes

---

## 2) Sitemap: asegurar `/sitemap.xml` en producción
### Problema
En producción el sitemap daba **404** porque:
- Astro generaba `sitemap-index.xml`/`sitemap-0.xml`, pero no necesariamente `sitemap.xml`.
- En Vercel (Linux) un comando tipo `copy` de Windows no funciona.

### Solución aplicada
Se creó/ajustó un script cross-platform `copy-sitemap` en `package.json` que:
- Busca en `dist/` uno de estos archivos:
  - `dist/sitemap-index.xml`
  - `dist/sitemap-0.xml`
  - `dist/sitemap.xml`
- Copia el primero que exista a `dist/sitemap.xml`.

Además, para Vercel:
- Copia `dist/sitemap.xml` a `.vercel/output/static/sitemap.xml` cuando esa carpeta exista.

### Resultado esperado
- `https://www.omarfuentes.com/sitemap.xml` responde **200** y devuelve un **sitemap index**.
- `https://www.omarfuentes.com/sitemap-0.xml` responde **200** y lista URLs reales.

---

## 3) Rutas dinámicas: getStaticPaths válido (Astro)
### Problema
El build fallaba en Vercel por:
- `getStaticPaths()` devolviendo un param inválido para rutas `src/pages/**/[...slug].astro`.

Astro exige que `params.slug` sea **string/number/undefined** (no array).

### Solución aplicada
- Se corrigieron los `getStaticPaths()` para que `slug` sea string.

Esto evita:
- fallos de build
- deploy incompleto
- URLs que Google descubre pero en realidad no existen en producción

---

## 4) Dominio canónico: unificar `www`
### Problema
Search Console tenía sitemaps con `www` y sin `www`.
Esto puede:
- dividir señales
- mostrar estados inconsistentes (páginas descubiertas 0 en un host)

### Solución aplicada
En `astro.config.mjs`:
- `site: 'https://www.omarfuentes.com'`
- `robotsTxt.host: 'https://www.omarfuentes.com'`

En `public/robots.txt`:
- `Sitemap: https://www.omarfuentes.com/sitemap.xml`
- `Host: https://www.omarfuentes.com`

### Recomendación en Search Console
- Mantener **solo**: `https://www.omarfuentes.com/sitemap.xml`
- Eliminar el sitemap sin `www` si no aporta.

---

## 5) Verificaciones rápidas (checklist)
### En navegador
- `https://www.omarfuentes.com/robots.txt` -> 200
- `https://www.omarfuentes.com/sitemap.xml` -> 200
- `https://www.omarfuentes.com/sitemap-0.xml` -> 200
- Un post:
  - `https://www.omarfuentes.com/blog/diseno-web-freelance-guia-completa/` -> 200
- Un portfolio:
  - `https://www.omarfuentes.com/portfolio/app-salud/` -> 200

### En Search Console
1. **Sitemaps**
   - Enviar/reenviar: `https://www.omarfuentes.com/sitemap.xml`
   - Esperar lectura.
2. **Inspección de URL**
   - Probar 1-3 URLs críticas
   - Click: **Solicitar indexación**

---

## 6) Qué esperar
Con sitemap + robots + rutas correctas:
- Google debería pasar progresivamente de **"Descubierta"** a **"Rastreada/Indexada"**.
- Puede tardar **horas a días** dependiendo del crawl budget.

---

## Notas opcionales
- Si hay URLs que no quieres indexar (p.ej. páginas "old"), se pueden:
  - marcar con `noindex` (meta robots)
  - o excluir del sitemap (si aplica)
