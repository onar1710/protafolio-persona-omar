---
title: 'SSR Duplica Páginas: El Error Que Google Castiga'
description: 'Next.js, Nuxt y SvelteKit generan la misma página en múltiples URLs como /productos, /productos/index y /productos/index.html. Aprende a configurar canonical tags, redirecciones y robots.txt para eliminar contenido duplicado en frameworks SSR.'
keywords: 'contenido duplicado nextjs google, nextjs canonical tag configurar, nuxt contenido duplicado seo, framework ssr páginas duplicadas, google penaliza contenido duplicado javascript, sitemap nextjs páginas repetidas'
relatedGroup: 'frameworks'
pubDate: '2026-05-05T12:00:00-05:00'
heroImageUrl: '/assets/blog/tu-framework-ssr-genera-paginas-duplicadas-google-hero.jpg'
---

Tu tráfico orgánico cayó un 15% la semana pasada y no cambiaste nada en el contenido. No actualizaste diseños, no moviste URLs, no tocaste los headings. Todo parece igual en Search Console excepto una métrica: las páginas indexadas bajaron y aparecen advertencias de contenido canónico. Si estás usando Next.js, Nuxt o SvelteKit, hay una buena probabilidad de que tu framework esté generando múltiples versiones de la misma página sin que te hayas dado cuenta, y que Google esté interpretando esas versiones como contenido duplicado.

Este problema afecta a una cantidad enorme de sitios construidos con frameworks SSR modernos. No es un bug de estos frameworks. Es una consecuencia de cómo manejan las rutas y cómo los servidores web interpretan esas rutas antes de que el framework entre en juego. La diferencia entre lo que el framework entrega y lo que Google puede acceder genera páginas repetidas que diluyen tu autoridad y confunden al crawler.

## El problema real: múltiples URLs para una misma página

Cuando construyes una ruta en Next.js como `/productos`, el framework genera una página accessible en `tudominio.com/productos`. Esa es la URL que quieres que Google indexe. Pero en el build de producción, Next.js también puede generar un archivo `productos/index.html` dentro de la carpeta estática. Si tu servidor estático (Nginx, Apache, Vercel) está configurado para servir archivos con extensión `.html`, entonces si `tudominio.com/productos/index.html` devuelve exactamente el mismo contenido.

Ahora agrega la tercera variante: `tudominio.com/productos/index`. Algunas configuraciones de servidor resuelven esa ruta también hacia el mismo contenido. Tres URLs diferentes, mismo contenido exacto. Googlebot las rastrea todas y las compara. Si no encuentra un canonical tag que le indique cuál es la URL canónica, indexa todas las variantes o elige una arbitrariamente. En ambos casos pierdes control sobre qué URL aparece en los resultados de búsqueda.

### Next.js y el problema de trailing slashes

Next.js tiene un comportamiento específico con trailing slashes que amplifica el problema de duplicación. Si `trailingSlash` está configurado como `true` en `next.config.js`, cada ruta accesible sin barra al final (`/productos`) redirige a la versión con barra (`/productos/`). Pero si el crawler accede a ambas antes de procesar la redirección, las trata como URLs separadas.

El caso más problemático es cuando `trailingSlash` no está configurado de forma consistente entre el router de Next.js, la configuración del servidor y el sitemap. Si tu sitemap incluye `/productos` pero el servidor redirige a `/productos/`, y tu canonical apunta a `/productos/index.html`, Google recibe tres señales diferentes para la misma página. Esa confusión se traduce en contenido duplicado indexado.

### Nuxt y la generación de rutas estáticas

Nuxt tiene un comportamiento similar cuando usas `generate` para crear una versión estática de tu sitio. El comando `nuxt generate` produce archivos HTML en carpetas con `index.html`, lo que crea la misma situación: `tudominio.com/productos/` y `tudominio.com/productos/index.html` sirven el mismo contenido.

Nuxt 3 con Nitro maneja esto de forma diferente a Nuxt 2, pero la mayoría de proyectos en producción aún usan configuraciones heredadas donde el problema persiste. Si tu `nuxt.config.js` tiene `static: true` o si estás generando el sitio estáticamente sin configurar `routes` en `generate`, cada página puede ser accesible a través de múltiples variaciones de URL.

## Cómo detectar el contenido duplicado en tu sitio

### Search Console como primer diagnóstico

Abre Google Search Console y ve a la pestaña de Cobertura. Filtra las páginas marcadas como "Excluidas" y busca la razón "Alternativa canónica diferente". Si ves muchas páginas con esa etiqueta, es una señal de que Google está encontrando contenido similar en múltiples URLs y está eligiendo canónicas por ti, probablemente no las que tú quieres.

Luego ve a la pestaña de Rendimiento y filtra por páginas. Compara las URLs que tienen clics e impresiones con las que tienen impresiones pero cero clics. Si ves variaciones de la misma ruta (una con trailing slash, otra sin ella, otra con `.html` al final), estás frente al problema de duplicación.

### Rastreo manual con Screaming Frog o curl

Screaming Frog es la herramienta más directa para detectar contenido duplicado. Configura un rastreo de tu sitio y en los resultados busca la pestaña de "Page Titles" o "Meta Description" con duplicados. Cada título o descripción que aparezca más de una vez con URLs diferentes es una señal de que la misma página está accesible a través de múltiples rutas.

Si no tienes acceso a Screaming Frog, usa curl desde tu terminal para verificar manualmente:

```bash
curl -sI https://tudominio.com/productos | head -5
curl -sI https://tudominio.com/productos/ | head -5
curl -sI https://tudominio.com/productos/index | head -5
curl -sI https://tudominio.com/productos/index.html | head -5
```

Si más de una de esas URLs devuelve un 200 OK con el mismo contenido, tienes un problema confirmado. Lo ideal es que solo una responda 200 y las demás redirijan con 301 a la URL canónica.

## Soluciones específicas por framework

### Canonical tags dinámicos en Next.js

El canonical tag le dice a Google cuál es la URL oficial de una página. En Next.js, configúralo en `_document.js` o usando el componente `Head` de `next/head` en cada página. Lo ideal es que el canonical sea dinámico y se genere a partir de la URL canónica que tú definas:

```javascript
import Head from 'next/head';
import { useRouter } from 'next/router';

function canonicalUrl() {
  const router = useRouter();
  return `https://tudominio.com${router.pathname}`;
}
```

Eso garantiza que cada página tenga un canonical que apunta a la URL sin variaciones. Pero el canonical solo funciona si Google puede acceder a la página original. Si la página canónica devuelve un error, Google ignora el canonical y usa la primera URL que pueda rastrear.

### Redirecciones 301 en Next.js

En `next.config.js`, configura redirects que consoliden todas las variantes hacia una sola URL canónica:

```javascript
module.exports = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/:path+/index',
        destination: '/:path+',
        permanent: true,
      },
      {
        source: '/:path+.html',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};
```

Con esta configuración, `/productos/index` y `/productos/index.html` redirigen permanentemente a `/productos`. Google procesa la redirección 301 y consolida la autoridad en la URL canónica.

### Nuxt: configuración de generate y routes

En Nuxt 3, usa `nitro` para controlar cómo se generan las rutas estáticas. En `nuxt.config.js`:

```javascript
export default {
  nitro: {
    prerender: {
      routes: ['/productos'],
    },
  },
  app: {
    head: {
      link: [
        { rel: 'canonical', href: 'https://tudominio.com/productos' }
      ],
    },
  },
};
```

Para Nuxt 2 con `generate`, define las rutas manualmente en `nuxt.config.js` y asegúrate de que cada ruta tenga un canonical explícito. La sección `generate.routes` te permite controlar exactamente qué URLs se generan durante el build.

### SvelteKit y la configuración de prerendering

SvelteKit maneja las rutas de forma diferente, pero el problema de duplicación persiste cuando se despliega en servidores que resuelven rutas de forma ambigua. En `svelte.config.js`, configura `paths.relative` y usa `prerender` para controlar qué páginas se generan. El canonical tag se configura en `+layout.svelte` o en cada `+page.svelte` individual.

## Robots.txt: la primera línea de defensa

Antes de configurar redirecciones complejas, revisa tu `robots.txt`. Si tu archivo robots.txt no bloquea las variantes de URL que no quieres que Google rastree, el crawler va a seguir indexándolas.

Un `robots.txt` para un sitio con problemas de contenido duplicado debe bloquear las rutas que generan duplicados:

```
User-agent: *
Disallow: /*/index.html
Disallow: /*/index
Allow: /
```

Eso le dice a Google que no rastree las URLs con `/index.html` o `/index` al final, pero sí todas las demás. Es una solución rápida que no requiere modificar el código del framework, aunque lo ideal es combinarla con redirecciones 301 para una consolidación completa.

## El sitemap como herramienta de consolidación

Tu sitemap XML debe contener solo las URLs canónicas. Si tu proceso de generación de sitemap incluye todas las variantes de URL, Google recibe una señal contradictoria: el sitemap le dice que todas son importantes, pero el canonical le dice que solo una lo es.

Verifica que tu sitemap esté generado correctamente. En Next.js, si usas `next-sitemap`, revisa la configuración para excluir URLs con trailing slash inconsistente. En Nuxt, el módulo `@nuxtjs/sitemap` genera sitemaps automáticamente, pero necesitas configurar `trailingSlash` de forma consistente.

El sitemap es un documento que Google usa como guía para rastrear tu sitio. Si contiene URLs duplicadas, estás perdiendo tu crawling budget en páginas que no deberían ser rastreadas individualmente.

## Checklist de acción inmediata

Si sospechas que tu framework SSR está generando contenido duplicado, sigue estos pasos en orden:

- Verifica con curl si las variantes de URL de tus páginas principales devuelven 200 OK
- Revisa Search Console para páginas excluidas por canonical alternativo
- Configura `trailingSlash` de forma consistente en tu framework y en tu servidor
- Implementa redirects en tu framework que consoliden variantes hacia la URL canónica
- Agrega canonical tags dinámicos a todas las páginas que se indexan
- Configura robots.txt para bloquear rutas duplicadas
- Actualiza tu sitemap para incluir solo URLs canónicas
- Vuelve a rastrear tu sitio con Screaming Frog después de los cambios

## Conclusión

El contenido duplicado en frameworks SSR no es un error de código ni una mala práctica de desarrollo. Es una consecuencia de cómo los frameworks modernos generan rutas estáticas y cómo los servidores web interpretan esas rutas. Next.js, Nuxt y SvelteKit todos pueden producir múltiples URLs para la misma página si la configuración no es explícita.

La solución no es abandonar SSR. Es configurar correctamente canonical tags, redirecciones y robots.txt para que Google solo vea una versión de cada página. La detección temprana a través de Search Console y herramientas de crawling te permite corregir el problema antes de que afecte significativamente tu tráfico orgánico.

Cada página que Google indexa como duplicada diluye la autoridad de la URL canónica. Resolver el problema de duplicación es una de las acciones de SEO técnico con mayor impacto por esfuerzo invertido, porque estás consolidando señales que ya existen en lugar de crear contenido nuevo.

## Preguntas frecuentes

**¿Cómo afecta el contenido duplicado al posicionamiento de mi sitio?**

Google distribuye la autoridad entre todas las versiones de una página duplicada. Si tu página `/productos` tiene autoridad y Google también indexa `/productos/index.html` y `/productos/index`, esa autoridad se divide entre las tres URLs. El resultado es que ninguna de las tres compite con fuerza en los resultados de búsqueda, y tu tráfico orgánico cae sin que hayas cambiado nada en tu contenido.

**¿Canonical tag solo es suficiente para resolver el problema de duplicación?**

El canonical tag es una señal, no una instrucción. Google puede ignorar el canonical si la página canónica tiene errores de rastreo o si las variantes no redirigen correctamente. Lo ideal es combinar canonical tags con redirecciones 301 y configuración correcta de robots.txt para una solución completa.

**¿Next.js con Vercel tiene este problema de contenido duplicado?**

Vercel maneja las redirecciones y el routing de forma integrada con Next.js, lo que reduce significativamente el problema. Sin embargo, si tu dominio apunta a Vercel a través de DNS y tienes configuraciones personalizadas de redirect o headers, el problema puede persistir. Verifica siempre con curl después de cada despliegue.

**¿Cuánto tiempo tarda Google en procesar las redirecciones 301 después de implementarlas?**

Google procesa las redirecciones 301 generalmente en el próximo rastreo del sitio. Para sitios con crawling frecuente, los cambios pueden reflejarse en pocos días. Para sitios nuevos o con bajo tráfico, el proceso puede tomar entre una y dos semanas. Puedes acelerar el proceso enviando las URLs afectadas a la cola de rastreo de Google Search Console.

**¿El contenido duplicado afecta todas las páginas del sitio o solo las que tienen variaciones de URL?**

Solo afecta las páginas que son accesibles a través de múltiples URLs. Si tu sitio tiene 500 páginas y solo 20 tienen variaciones de URL (por trailing slash o index.html), el problema afecta esas 20 páginas. Pero esas 20 pueden ser páginas importantes como categorías, productos o landing pages que concentran tráfico significativo.