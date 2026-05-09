---
title: 'Diseño Web SEO: Guía Completa para Crear un Sitio que Posicione en Google'
description: 'Aprende a crear un diseño web SEO desde cero. Guía completa de diseño web y posicionamiento SEO para que tu sitio posicione en Google.'
keywords: 'diseño web seo, diseño web y posicionamiento seo, diseño web posicionamiento seo, diseño y posicionamiento web, seo pagina web, web seo'
pubDate: 2026-02-25
heroImage: '/assets/blog/diseno-web-seo.jpg'
tags: ["Posicionar mi web en Google"]
---

# Diseño Web SEO: Guía Completa para Crear un Sitio que Posicione en Google
...

![Hosting, servidor y despliegue](/assets/blog/Hosting-servidor-despliegue.jpg "Hosting, servidor y despliegue: la base técnica de tu diseño web SEO")

...

![Diseño web responsive](/assets/blog/Diseño-web-responsive-móvil-tablet-PC-obligatorio-SEO.jpg "Diseño web responsive: móvil, tablet y PC obligatorio para el SEO")

...

![Tecnologías para construir tu diseño web SEO moderno](/assets/blog/tecnologias-para-construir-tu-diseno-web-seo-moderno.jpg "Tecnologías para construir tu diseño web SEO moderno")

...

![Arquitectura de la información](/assets/blog/arquitectura-informacion-organiza-tu-sitio-antes-construirlo.jpg "Arquitectura de la información: organiza tu sitio antes de construirlo")

...

![Enlazado interno y anchor text](/assets/blog/enlazado-interno-anchor-text-diseno-web-seo.jpg "Enlazado interno y anchor text en el diseño web SEO")

...

![Errores en el código que pueden hundir tu diseño web SEO](/assets/blog/errores-estan-destruyendo-diseno-web-seo-tu-sitio.jpg "Errores en el código que pueden hundir tu diseño web SEO")

...
Mal:
```html
<p>Este es mi contenido
<p>Este es otro párrafo
```

Bien:
```html
<p>Este es mi contenido</p>
<p>Este es otro párrafo</p>
```

No usar etiquetas semánticas: Si toda tu página está construida con divs Google no va a entender qué es importante.

Mal:
```html
<div class="titulo">Diseño Web SEO</div>
<div class="texto">Contenido de la página</div>
```

Bien:
```html
<h1>Diseño Web SEO</h1>
<p>Contenido de la página</p>
```

Imágenes sin atributo alt: Google no puede ver imágenes, solo lee el texto alternativo.

Mal:
```html
<img src="diseño-web.jpg">
```

Bien:
```html
<img src="diseño-web.jpg" alt="Diseño web SEO optimizado para Google">
```

Estos errores parecen pequeños pero Google los detecta y los toma en cuenta al momento de posicionar tu sitio. Revisa tu página de inicio primero, es la más importante y debe tener el código más limpio de todo tu sitio.


### Cómo se maneja el código según la tecnología que eligas

![Cómo se maneja el código según la tecnología que eligas](/assets/blog/como-se-maneja-codigo-segun-tecnologia-eligas.jpg "Cómo se maneja el código según la tecnología que eligas")

Dependiendo de la tecnología que hayas elegido el código va a funcionar de forma diferente y eso impacta el SEO de tu sitio.

En WordPress no vas a escribir HTML directamente en la mayoría de los casos, lo vas a gestionar desde el editor pero es fundamental que el tema que uses genere HTML5 limpio y semántico por debajo.

En Astro y Next.js vas a escribir componentes que generan HTML5 optimizado automáticamente, lo que los hace tecnologías muy superiores para el SEO técnico desde la base.

En HTML y CSS estático tú tienes control total del código, lo que significa que puedes hacerlo perfecto pero también significa que cualquier error es tu responsabilidad directa.

En Bootstrap el código responsive se genera rápido pero debes asegurarte de no cargar estilos innecesarios que pesen y ralenticen tu sitio.


### Los mejores editores de código para codificar y construir tu diseño web SEO

La herramienta con la que escribes el código también importa. Un buen editor te ayuda a detectar errores antes de que aparezcan en tu sitio y hace tu trabajo mucho más eficiente.

Visual Studio Code es el más usado en el mundo, gratuito, con miles de extensiones y perfecto para cualquier tecnología que elijas.

Sublime Text es ligero, rápido y muy popular entre desarrolladores que prefieren una herramienta sin distracciones.

WebStorm es el editor más completo para JavaScript y frameworks como Next.js y Astro, ideal para proyectos grandes aunque es de pago.

Cursor y Windsurf son editores modernos que incorporan inteligencia artificial para ayudarte a escribir código más rápido y con menos errores, ideales si estás aprendiendo o quieres acelerar el proceso de construcción.

Zed es una opción ultrarrápida y minimalista que está ganando mucha popularidad entre desarrolladores que buscan rendimiento puro.

Cualquiera de estos editores te va a funcionar bien. Lo importante es que te sientas cómodo con el que elijas y lo uses consistentemente.


## Velocidad de carga y Core Web Vitals: el combustible técnico del diseño web SEO

![Velocidad de carga y Core Web Vitals](/assets/blog/velocidad-carga-core-web-vitals-combustible-tecnico-diseno-web-seo.jpg "Velocidad de carga y Core Web Vitals: el combustible técnico del diseño web SEO")

Si hay algo que Google mide sin piedad es la velocidad de tu sitio. Un diseño web SEO lento es un diseño web SEO que no posiciona, así de simple.

Pero no se trata solo de que cargue rápido. Google tiene métricas específicas que mide en tiempo real llamadas Core Web Vitals y estas métricas son un factor de ranking oficial desde 2021.

---

### Qué son los Core Web Vitals y por qué importan para el diseño web SEO

Los Core Web Vitals son tres métricas que Google usa para medir la experiencia real del usuario en tu sitio. Si estas métricas están mal tu sitio va a tener dificultades para posicionarse sin importar qué tan buen contenido tenga.

Las tres métricas son:

LCP: Largest Contentful Paint
Mide cuánto tarda en cargar el elemento más grande de tu página, como una imagen principal o un bloque de texto. Google quiere que esto ocurra en menos de 2.5 segundos.

```
Bueno: menos de 2.5 segundos
Necesita mejora: entre 2.5 y 4 segundos
Malo: más de 4 segundos
```

FID: First Input Delay
Mide cuánto tarda tu sitio en responder cuando el usuario hace click en algo. Google quiere que sea menos de 100 milisegundos.

```
Bueno: menos de 100ms
Necesita mejora: entre 100ms y 300ms
Malo: más de 300ms
```

CLS: Cumulative Layout Shift
Mide cuánto se mueven los elementos de tu página mientras carga. Cuando entras a un sitio y los botones o textos se desplazan solos mientras cargan eso es un CLS alto y Google lo penaliza.

```
Bueno: menos de 0.1
Necesita mejora: entre 0.1 y 0.25
Malo: más de 0.25
```

---

### Cómo mejorar la velocidad desde el diseño web SEO

La velocidad no se arregla después de construir el sitio. Se planifica desde el diseño. Aquí te explico cómo hacerlo bien desde el principio.

Lazy loading en imágenes: Las imágenes deben cargarse solo cuando el usuario llega a ellas, no todas al mismo tiempo.

```html
<!-- Sin lazy loading - carga todo de golpe -->
<img src="imagen-hero.jpg" alt="Diseño Web SEO">

<!-- Con lazy loading - carga cuando el usuario llega -->
<img src="imagen-hero.jpg" alt="Diseño Web SEO" loading="lazy">
```

Minificación de CSS y JavaScript: Los archivos de estilos y scripts deben estar comprimidos para que pesen menos y carguen más rápido. Tecnologías como Astro y Next.js hacen esto automáticamente. En WordPress necesitas un plugin como WP Rocket o LiteSpeed Cache.

Uso de CDN: Un CDN distribuye tu sitio desde servidores cercanos al usuario. Si alguien en México visita tu sitio y tu servidor está en Colombia, un CDN sirve el contenido desde un servidor en México. Vercel, Netlify y Cloudflare Pages tienen CDN global incluido.

---

### Herramientas para medir la velocidad de tu diseño web SEO

Antes de publicar tu sitio y después de publicarlo debes medir constantemente su velocidad. Estas son las herramientas que debes usar:

Google PageSpeed Insights: La herramienta oficial de Google. Te da una puntuación de 0 a 100 y te explica exactamente qué está fallando en tu sitio.

```
pagespeed.web.dev
```

Google Search Console: Te muestra el reporte de Core Web Vitals de tu sitio con datos reales de usuarios.

GTmetrix: Te da un análisis detallado de la velocidad con recomendaciones específicas para mejorar.

```
gtmetrix.com
```

Un sitio bien construido para diseño web SEO debe apuntar a una puntuación de 90 o más en PageSpeed Insights tanto en móvil como en escritorio. Ese es el estándar que Google premia con mejores posiciones. Si tu sitio actual tiene errores comunes, nuestro artículo sobre **[errores de diseño web](/blog/errores-diseno-web)** te ayudará a identificarlos y corregirlos.

## Optimización de imágenes: un detalle que define el diseño web SEO

![Optimización de imágenes](/assets/blog/optimizacion-imagenes-un-detalle-que-define-diseno-web-seo.jpg "Optimización de imágenes: un detalle que define el diseño web SEO")

Antes de subir cualquier imagen a tu sitio quiero que te detengas un momento. Las imágenes son uno de los elementos que más pesan en un sitio web y si no las optimizas correctamente van a ralentizar todo lo que has construido hasta ahora y el diseño web SEO va a sufrir las consecuencias.

Haz esto bien desde el principio y tus imágenes van a trabajar a favor del posicionamiento, no en contra.

---

### Elige el formato correcto antes de subir cualquier imagen

Lo primero que tienes que hacer es revisar en qué formato están tus imágenes. Abre tu carpeta de imágenes y fíjate bien porque el formato que elijas impacta directamente el peso y la velocidad del diseño web SEO.

```
JPG: Úsalo para fotografías y imágenes con muchos colores
PNG: Úsalo solo cuando necesites fondo transparente
WebP: Este es el que debes usar siempre que puedas
SVG: Perfecto para logos e iconos, pesa casi nada
GIF: No lo uses, pesa demasiado y daña la velocidad
```

Convierte tus imágenes a WebP antes de subirlas. Pesan hasta un 30% menos que JPG y PNG con la misma calidad visual. Google lo recomienda oficialmente y tu sitio te lo va a agradecer en velocidad y posicionamiento.

---

### Ponle nombre correcto a cada imagen antes de subirla

Antes de subir esa imagen a tu sitio revisa cómo se llama el archivo. Si el nombre es algo como IMG_0042.jpg o foto1.png cámbialo ahora mismo porque Google lee ese nombre y si no le dice nada no te está ayudando en nada.

Nombre de archivo malo:
```
IMG_20240315_142356.jpg
foto1.png
image-final-v3.jpg
```

Nombre de archivo bueno:
```
diseno-web-seo-colombia.webp
sitio-web-optimizado-google.webp
agencia-diseno-web-cali.webp
```

Usa palabras separadas por guiones, todo en minúsculas y sin tildes. Describe lo que muestra la imagen e incluye tu keyword cuando sea natural. Ese nombre es una señal directa para el diseño web SEO.

---

### Escribe el atributo ALT de cada imagen

Ahora que ya tienes la imagen con el nombre correcto y en el formato adecuado es momento de subirla. Pero antes de guardar asegúrate de completar el atributo ALT porque Google no puede ver tus imágenes como tú las ves. Lo único que Google lee es ese texto alternativo.

ALT mal usado:
```html
<img src="imagen1.jpg" alt="">
<img src="DSC_0042.jpg" alt="imagen">
<img src="foto.jpg" alt="foto de la página">
```

ALT bien usado:
```html
<img src="diseno-web-seo-colombia.webp" 
alt="Diseño web SEO profesional en Colombia">

<img src="sitio-web-optimizado.webp" 
alt="Sitio web optimizado para posicionar en Google">
```

Describe exactamente lo que muestra la imagen e incluye la keyword cuando sea natural. Ese detalle abre la puerta al tráfico de Google Imágenes y fortalece el diseño web SEO de cada página.

---

### Comprime cada imagen antes de publicarla

Ya tienes la imagen con el nombre correcto, en WebP y con el ALT bien escrito. Ahora antes de publicarla pásala por una de estas herramientas de compresión. Este paso es obligatorio para mantener la velocidad del diseño web SEO.

TinyPNG y TinyJPG: Entra a tinypng.com, arrastra tu imagen y descárgala comprimida. Vas a ver cómo el peso baja sin que la calidad cambie.
```
tinypng.com
```

Squoosh: La herramienta de Google. Entra, sube tu imagen, conviértela a WebP y ajusta la calidad. Gratuita y muy fácil de usar.
```
squoosh.app
```

Cloudinary: Si tu sitio tiene muchas imágenes esta plataforma las optimiza y las sirve automáticamente desde un CDN. Ideal para tiendas online o sitios con mucho contenido visual.
```
cloudinary.com
```

ShortPixel: Si usas WordPress instala este plugin y va a comprimir automáticamente cada imagen que subas al sitio sin que tengas que hacer nada manualmente.

Ninguna imagen debe llegar a tu sitio sin haber pasado por este proceso. Hazlo un hábito desde hoy y el diseño web SEO va a mantener una velocidad óptima que Google va a notar y premiar.

## Los metadatos: lo que Google lee antes que nadie en el diseño web SEO

![Metadatos que Google lee](/assets/blog/metadatos-que-google-lee-antes-que-nadie-diseno-web-seo.jpg "Metadatos: lo que Google lee antes que nadie en el diseño web SEO")

Cuando Google entra a tu sitio lo primero que lee no es tu contenido visible. Lee los metadatos. Son etiquetas que viven en el código de tu página y le dicen a Google exactamente de qué trata tu sitio, cómo mostrarlo en los resultados de búsqueda y cómo presentarlo en redes sociales.

Si los metadatos están mal configurados el diseño web SEO falla desde adentro aunque el sitio se vea perfecto por fuera. Vamos a configurarlos bien ahora mismo.

---

### El title, la etiqueta más importante del diseño web SEO

Abre el código de tu página principal y busca la etiqueta title dentro del head. Esta etiqueta es el título que Google muestra en los resultados de búsqueda y es una de las señales más importantes para el posicionamiento.

Title mal configurado:
```html
<title>Inicio</title>
<title>Página 1</title>
<title>Bienvenido a mi sitio web</title>
```

Title bien configurado:
```html
<title>Diseño Web SEO en Colombia | Omar Fuentes</title>
<title>Diseño Web y Posicionamiento SEO | Sitios que Rankean en Google</title>
```

Tu title debe tener entre 50 y 60 caracteres, incluir la keyword principal y describir exactamente lo que hace tu página. Cada página de tu sitio debe tener un title único y diferente. Nunca repitas el mismo title en dos páginas.

---

### La meta descripción que invita a hacer click

Ahora busca la etiqueta meta description en el código. Esta es la descripción que aparece debajo del título en Google. No impacta directamente el ranking pero sí impacta el click, y más clicks le dicen a Google que tu resultado es relevante para el diseño web SEO.

Meta descripción mal configurada:
```html
<meta name="description" content="Sitio web">
<meta name="description" content="Bienvenido a nuestra página">
```

Meta descripción bien configurada:
```html
<meta name="description" content="Aprende a crear un diseño web SEO 
que posicione en Google desde el primer día. 
Guía completa para negocios en Colombia y Latinoamérica.">
```

Escríbela entre 150 y 160 caracteres. Incluye la keyword de forma natural y termina con una llamada a la acción que invite al usuario a hacer click.

---

### Open Graph: cómo se ve tu sitio en redes sociales

Cuando alguien comparte tu sitio en Facebook, WhatsApp o LinkedIn lo que se muestra es lo que tú defines en las etiquetas Open Graph. Si no las tienes configuradas las redes sociales van a mostrar cualquier imagen y cualquier texto de tu sitio, y eso daña la imagen del diseño web SEO que estás construyendo.

Configura estas etiquetas en el head de cada página:

```html
<meta property="og:title" 
content="Diseño Web SEO en Colombia | Omar Fuentes">

<meta property="og:description" 
content="Crea un diseño web con SEO que posicione 
en Google desde el primer día.">

<meta property="og:image" 
content="https://tudominio.com/imagen-portada.webp">

<meta property="og:url" 
content="https://tudominio.com/diseno-web-seo">
```

Asegúrate de que la imagen tenga 1200x630 píxeles. Ese es el tamaño ideal para que se vea perfecta en cualquier red social.

---

### Schema JSON-LD: habla el idioma de Google

Este es el punto que más diferencia a un diseño web SEO bien ejecutado de uno mediocre. El Schema JSON-LD son datos estructurados que le explican a Google en su propio idioma quién eres, qué ofreces y de qué trata cada página de tu sitio.

Cuando Google entiende esto puede mostrarte en resultados enriquecidos como estrellitas de reseñas, preguntas frecuentes o información de tu negocio directamente en el buscador.

Schema básico para una página de servicios:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Omar Fuentes - Diseño Web SEO",
  "description": "Diseño web y posicionamiento SEO 
  para negocios en Colombia y Latinoamérica",
  "url": "https://omarfuentes.com",
  "telephone": "+573107851074",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CO",
    "addressLocality": "Colombia"
  }
}
</script>
```

Schema para un artículo de blog:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Diseño Web SEO: Cómo crear un sitio 
  que posicione en Google",
  "author": {
    "@type": "Person",
    "name": "Omar Fuentes"
  },
  "datePublished": "2026-01-01",
  "image": "https://omarfuentes.com/imagen.webp"
}
</script>
```

Agrega el Schema correcto en cada página de tu sitio. No es opcional si quieres que el diseño web SEO compita en serio en Google.


##SSL y seguridad: la base de confianza del diseño web SEO

Antes de publicar tu sitio hay algo que tienes que activar sí o sí. El certificado SSL. Si tu sitio no lo tiene Google lo marca como inseguro y eso destruye la confianza del usuario y el posicionamiento del diseño web SEO al mismo tiempo.

Mira la diferencia en la barra del navegador:

```
Sin SSL:  http://tudominio.com   🔴 No seguro
Con SSL:  https://tudominio.com  🔒 Seguro
```

Ese candado verde no es solo visual. Es una señal directa para Google de que tu sitio es confiable y merece posicionarse.

---

### Cómo activar el SSL en tu sitio

![Cómo activar el SSL en tu sitio](/assets/blog/como-activar-ssl-en-tu-sitio.jpg "Cómo activar el SSL en tu sitio")

Entra al panel de control de tu hosting. Si usas Hostinger o SiteGround vas a encontrar la opción de SSL en la sección de seguridad. Actívalo con un solo click. La mayoría de los hostings hoy ofrecen el certificado SSL gratuito a través de Let's Encrypt.

Si desplegaste tu sitio en Vercel o Netlify el SSL se activa automáticamente desde el momento en que conectas tu dominio. No tienes que hacer nada adicional.

Una vez activado verifica que tu sitio cargue correctamente con https y que no quede ninguna URL interna apuntando a http. Ese error es más común de lo que crees y afecta directamente el diseño web SEO.

---

### Verifica que todas las URLs de tu sitio usen HTTPS

Abre tu sitio y revisa cada enlace interno. Si tienes URLs mezcladas entre http y https Google las va a tratar como páginas diferentes y eso genera contenido duplicado que penaliza el posicionamiento.

URL incorrecta dentro del sitio:
```html
<a href="http://tudominio.com/servicios">Servicios</a>
```

URL correcta dentro del sitio:
```html
<a href="https://tudominio.com/servicios">Servicios</a>
```

También verifica que las imágenes, los scripts y los archivos CSS estén cargando desde https. Si alguno carga desde http vas a tener lo que se conoce como contenido mixto y el navegador lo va a marcar como inseguro afectando la experiencia del usuario y el diseño web SEO.

---

### Configura la redirección de HTTP a HTTPS

Una vez que tienes el SSL activo necesitas asegurarte de que cualquier persona que entre a tu sitio por http sea redirigida automáticamente a https. Esta redirección se hace en el archivo .htaccess si usas un servidor Apache.

Abre tu archivo .htaccess y agrega esto:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Si usas Vercel o Netlify esta redirección ya está configurada automáticamente. No necesitas tocar nada.

Este paso garantiza que todo el tráfico de tu sitio fluya por una sola versión segura, lo que consolida la autoridad del diseño web SEO en una sola URL limpia.




## Robots.txt y Sitemap.xml: guíale el camino a Google

![Robots.txt y Sitemap.xml](/assets/blog/robotstxt-sitemapxml-guiale-camino-a-google.jpg "Robots.txt y Sitemap.xml: guíale el camino a Google")

Imagina que Google llega a tu sitio por primera vez. Necesita saber qué páginas puede visitar, qué páginas debe ignorar y cuál es el mapa completo de tu sitio. Esa información se la das tú a través de dos archivos fundamentales para el diseño web SEO: el robots.txt y el sitemap.xml.

Si estos archivos no están bien configurados Google puede indexar páginas que no quieres, ignorar páginas importantes o tardar semanas en descubrir tu contenido nuevo.

---

### Qué es el robots.txt y cómo configurarlo correctamente

El robots.txt es un archivo de texto que vive en la raíz de tu sitio y le indica a Google qué partes puede rastrear y cuáles no. Es el primer archivo que Google lee cuando llega a tu sitio.

Encuéntralo o créalo en:
```
tudominio.com/robots.txt
```

Robots.txt mal configurado:
```
User-agent: *
Disallow: /
```

Este error bloquea todo tu sitio. Google no puede indexar ninguna página y el diseño web SEO queda completamente paralizado.

Robots.txt bien configurado:
```
User-agent: *
Disallow: /admin/
Disallow: /privado/
Disallow: /wp-admin/
Allow: /

Sitemap: https://tudominio.com/sitemap.xml
```

Con esta configuración le estás diciendo a Google que puede rastrear todo tu sitio excepto las páginas administrativas y privadas que no tienen valor para el posicionamiento. Y al final le indicas dónde está tu sitemap para que lo encuentre de inmediato.

---

### Qué es el sitemap.xml y por qué lo necesita el diseño web SEO

El sitemap.xml es el mapa completo de tu sitio. Lista todas las páginas que quieres que Google indexe con su URL, fecha de actualización y prioridad. Cuando Google lo encuentra puede descubrir y rastrear todo tu contenido mucho más rápido.

Un sitemap.xml básico se ve así:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://tudominio.com/</loc>
    <lastmod>2026-01-01</lastmod>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://tudominio.com/diseno-web-seo/</loc>
    <lastmod>2026-01-01</lastmod>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://tudominio.com/servicios/</loc>
    <lastmod>2026-01-01</lastmod>
    <priority>0.8</priority>
  </url>

</urlset>
```

Si usas WordPress instala el plugin Yoast SEO o RankMath y el sitemap se genera automáticamente. Si usas Astro o Next.js puedes usar librerías como next-sitemap que lo generan automáticamente con cada despliegue.

---

### Envía tu sitemap a Google Search Console

Una vez que tienes tu sitemap listo no esperes a que Google lo encuentre solo. Entra a Google Search Console, selecciona tu propiedad y en el menú de la izquierda busca la opción Sitemaps.

Escribe la URL de tu sitemap:
```
https://tudominio.com/sitemap.xml
```

Haz click en enviar y Google va a empezar a rastrear e indexar todas las páginas de tu sitio de forma inmediata. Este paso acelera significativamente el proceso de indexación del diseño web SEO y posicionamiento te da visibilidad en Search Console sobre cuántas páginas están siendo indexadas correctamente.


## Las páginas esenciales que todo diseño web SEO necesita

![Las páginas esenciales que todo diseño web SEO necesita](/assets/blog/paginas-esenciales-diseno-web-seo-necesita.jpg "Las páginas esenciales que todo diseño web SEO necesita")

Cuando construyes tu sitio no puedes crear páginas al azar. Cada página tiene un propósito específico y Google las evalúa todas. Un diseño web SEO bien ejecutado tiene un conjunto de páginas esenciales que le dicen a Google que tu sitio es completo, confiable y relevante para el usuario.

Vamos a ver cuáles son y por qué cada una importa.

---

### La página Home

Es la página más importante de todo tu sitio. Es la primera impresión que recibe Google y el usuario al mismo tiempo. Tu Home debe comunicar en segundos quién eres, qué ofreces y a quién le hablas.

Un Home bien estructurado para el diseño web SEO debe tener:

```
H1 claro con tu keyword principal
Descripción de tu servicio o negocio
Llamada a la acción visible
Enlaces a tus páginas principales
Contenido relevante para Google
```

Si alguien entra a tu Home y en tres segundos no entiende qué haces, algo está mal. Corrígelo antes de pensar en cualquier otra cosa.

---

### La página de Servicios

Esta página le dice a Google exactamente qué ofreces. Cada servicio que prestas debe estar bien descrito con texto original, keywords relevantes y una llamada a la acción clara.

Si tienes varios servicios lo ideal es crear una página individual para cada uno. Así cada servicio puede posicionarse de forma independiente en Google y el diseño web SEO de cada página trabaja de manera específica para esa keyword.

Estructura recomendada:
```
tudominio.com/servicios/diseno-web-seo
tudominio.com/servicios/tienda-online
tudominio.com/servicios/rediseno-web
```

---

### La página de Contacto

La página de contacto no es solo un formulario. Es una señal de confianza para Google y para el usuario. Un sitio sin página de contacto visible genera desconfianza y eso impacta negativamente el diseño web SEO.

Tu página de contacto debe tener:

```
Formulario de contacto funcional
Número de teléfono o WhatsApp
Correo electrónico
Ciudad o país donde operas
```

Agrega también el Schema de contacto para que Google entienda esta información y pueda mostrarla directamente en los resultados de búsqueda.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contacto - Omar Fuentes Diseño Web SEO",
  "url": "https://omarfuentes.com/contacto",
  "telephone": "+573107851074",
  "email": "contacto@omarfuentes.com"
}
</script>
```

---

### La página de Blog

El blog es el motor de contenido del diseño web SEO. Es donde publicas artículos que responden las preguntas de tu audiencia, capturas tráfico orgánico y demuestras autoridad en tu tema.

Cada artículo que publicas es una nueva oportunidad de posicionarse en Google para una keyword diferente. Un blog activo y bien estructurado le dice a Google que tu sitio está vivo, se actualiza constantemente y merece estar en las primeras posiciones.

Tu blog debe estar en:
```
tudominio.com/blog
```

Y cada artículo en:
```
tudominio.com/blog/nombre-del-articulo
```

---

### Política de privacidad y términos y condiciones

Estas páginas son obligatorias. No son opcionales ni un simple trámite. Google las considera señales de confianza y transparencia. Un sitio sin política de privacidad ni términos y condiciones genera desconfianza tanto en el usuario como en el algoritmo.

Además si tu sitio recopila cualquier tipo de dato del usuario como nombre, correo o teléfono estás legalmente obligado a tener una política de privacidad visible y accesible.

Créalas en:
```
tudominio.com/politica-de-privacidad
tudominio.com/terminos-y-condiciones
```

Y enlázalas siempre desde el footer de tu sitio para que Google las encuentre fácilmente en cada página.

---

### La página Sobre mí o Sobre nosotros

Esta página construye el E-E-A-T de tu sitio. E-E-A-T significa Experiencia, Expertise, Autoridad y Confianza, y es uno de los factores que Google usa para evaluar la calidad de un sitio web.

Cuéntale a Google y al usuario quién eres, cuánta experiencia tienes, qué proyectos has realizado y por qué eres la persona indicada para ayudarle. Un diseño web SEO sin esta página está dejando sobre la mesa una señal de confianza muy poderosa.

Incluye en esta página:

```
Tu nombre y foto real
Tu experiencia y trayectoria
Proyectos o casos de éxito
Tu ubicación y mercado al que sirves
```

Eso le demuestra a Google que detrás del sitio hay una persona real con experiencia real. Y eso hoy en día vale mucho para el posicionamiento seo.



## La página Home: estructura y diseño web SEO que Google premia

La página Home es la más importante de todo tu sitio. Es la primera página que Google rastrea, la primera que el usuario ve y la que define si te quedas o te vas en menos de tres segundos. Si la Home no está bien construida todo el diseño web SEO que hayas hecho hasta ahora pierde fuerza.

Vamos a construirla bien desde el principio.

---

### El H1 de tu Home: la señal más importante para Google

Abre el código de tu página principal y busca el H1. Solo debe haber uno en toda la página y tiene que contener la keyword principal de tu negocio. Es la primera señal que Google lee para entender de qué trata tu sitio.

H1 mal estructurado:
```html
<h1>Bienvenido a nuestra página web</h1>
<h1>Hola somos una empresa</h1>
```

H1 bien estructurado:
```html
<h1>Diseño Web SEO en Colombia: Sitios que Posicionan en Google</h1>
```

Ese H1 le dice a Google en una sola línea qué haces, dónde lo haces y para qué sirve. Claro, directo y con la keyword exacta. Así es como debe ser.

---

### La estructura completa de una Home para el diseño web SEO

Una Home bien construida para el diseño web SEO no es solo texto bonito. Tiene una estructura específica que guía tanto al usuario como a Google desde arriba hacia abajo.

Así debe verse la estructura de tu Home:

```
Header
├── Logo
├── Menú de navegación principal
└── CTA visible (botón de contacto o WhatsApp)

Sección Hero
├── H1 con keyword principal
├── Descripción clara de tu servicio
└── Llamada a la acción

Sección de Servicios
├── H2: Servicios principales
├── Descripción breve de cada servicio
└── Enlace a la página de cada servicio

Sección de Resultados o Casos de Éxito
├── H2: Resultados reales
├── Testimonios o métricas
└── Fotos o capturas reales

Sección de Sobre mí o Sobre nosotros
├── H2: Quién soy
├── Foto real
└── Experiencia y trayectoria

Sección de Blog
├── H2: Artículos recientes
└── Últimas publicaciones con enlace

Footer
├── Links importantes
├── Política de privacidad
├── Términos y condiciones
└── Redes sociales
```

Cada sección tiene un propósito claro. No pongas nada en tu Home que no aporte valor al usuario o a Google.

---

### Los H2 de tu Home y cómo distribuirlos

Después del H1 vienen los H2. Cada sección principal de tu Home debe tener su propio H2 con keywords relevantes para el diseño web SEO. Estos H2 le dicen a Google qué temas cubre tu página principal.

H2 mal usados:
```html
<h2>Sección 1</h2>
<h2>Más información</h2>
<h2>Otros servicios</h2>
```

H2 bien usados:
```html
<h2>Servicios de Diseño Web con Posicionamiento SEO</h2>
<h2>Resultados reales para negocios en Latinoamérica</h2>
<h2>¿Por qué elegir un diseño web con posicionamiento SEO?</h2>
```

Cada H2 debe ser descriptivo, incluir keywords cuando sea natural y guiar al usuario hacia la siguiente sección de forma lógica.

---

### La velocidad de tu Home es crítica para el diseño web SEO

Tu Home es la página que más tráfico recibe y la que Google evalúa con más detalle. Si carga lento todo lo demás falla. Antes de publicarla entra a PageSpeed Insights y analízala.

```
pagespeed.web.dev
```

Apunta a estos resultados:

```
Móvil:      90 o más
Escritorio: 95 o más
LCP:        menos de 2.5 segundos
CLS:        menos de 0.1
```

Si alguna métrica está por debajo revisa las imágenes, el código y los scripts que estás cargando. Una Home lenta es una Home que no posiciona sin importar qué tan bien esté escrito el contenido.

---

### El contenido de tu Home debe hablarle a Google y al usuario al mismo tiempo

Esto es lo que muchos fallan. Escriben el contenido de la Home pensando solo en que se vea bonito y olvidan que Google también lo lee. Cada párrafo de tu Home debe tener texto real, descriptivo y con keywords naturales que refuercen el diseño web SEO.

Contenido mal escrito para la Home:
```
"Somos una empresa líder en soluciones digitales 
innovadoras para el mercado global."
```

Contenido bien escrito para la Home:
```
"Creo sitios web con diseño web SEO optimizado 
para negocios en Colombia y Latinoamérica que 
quieren aparecer en Google y convertir visitantes 
en clientes reales."
```

El segundo le dice a Google exactamente qué haces, a quién le hablas y cuál es el resultado que ofreces. Eso es diseño web SEO aplicado al contenido de tu página principal.

## El menú de navegación y su impacto en el diseño web SEO

![Menú de navegación y su impacto en el diseño web SEO](/assets/blog/menu-navegacion-su-impacto-en-diseno-web-seo.jpg "Menú de navegación y su impacto en el diseño web SEO")

El menú de tu sitio no es solo un elemento visual. Es una de las primeras cosas que Google rastrea cuando entra a tu página y le dice exactamente qué secciones tiene tu sitio y cuáles son las más importantes. Un menú mal estructurado confunde a Google y al usuario al mismo tiempo.

Vamos a construirlo bien ahora.

---

### La estructura correcta del menú para el diseño web SEO

Abre tu editor y revisa cómo está construido el menú de tu sitio. Debe ser simple, claro y directo. Cada enlace del menú es una señal para Google sobre las páginas más importantes de tu diseño web SEO.

Menú mal estructurado:
```
Inicio | Página 1 | Página 2 | Click aquí | Más
```

Menú bien estructurado:
```
Inicio | Servicios | Portafolio | Blog | Contacto
```

Cada elemento del menú debe tener un nombre descriptivo que el usuario y Google entiendan de inmediato. Nunca uses nombres genéricos que no digan nada.

---

### Cómo construir el menú en HTML semántico

El menú de tu sitio debe estar construido con etiquetas semánticas correctas. Esto le dice a Google que ese bloque de enlaces es la navegación principal del sitio y le da más peso dentro del diseño web SEO.

Menú mal construido:
```html
<div class="menu">
  <a href="/">Inicio</a>
  <a href="/servicios">Servicios</a>
  <a href="/blog">Blog</a>
  <a href="/contacto">Contacto</a>
</div>
```

Menú bien construido:
```html
<nav>
  <ul>
    <li><a href="/">Inicio</a></li>
    <li><a href="/servicios/diseno-web-seo">Diseño Web SEO</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/contacto">Contacto</a></li>
  </ul>
</nav>
```

La etiqueta nav le indica a Google que ese bloque es la navegación principal. Las etiquetas ul y li organizan los enlaces de forma jerárquica. Ese detalle marca la diferencia en el diseño web SEO.

---

### Los enlaces del menú deben incluir keywords cuando sea posible

Los textos de los enlaces de tu menú también son señales para Google. Cuando puedas incluir una keyword relevante en el texto del enlace hazlo de forma natural. Eso refuerza el diseño web SEO de las páginas a las que apuntas.

Texto de enlace sin keyword:
```html
<a href="/servicios">Ver servicios</a>
```

Texto de enlace con keyword:
```html
<a href="/servicios/diseno-web-seo">Diseño Web SEO</a>
```

No fuerces las keywords en cada enlace del menú. Hazlo donde sea natural y tenga sentido para el usuario. El equilibrio entre SEO y usabilidad es lo que Google premia en el diseño web SEO.

---

### El menú móvil también importa para el diseño web SEO

Recuerda que Google rastrea tu sitio como si fuera un usuario de celular. Tu menú debe funcionar perfectamente en móvil. Si el menú en móvil está roto, los enlaces no funcionan o los botones son demasiado pequeños para hacer click Google lo detecta y afecta el posicionamiento.

Verifica estos puntos en el menú móvil de tu sitio:

```
Los botones tienen al menos 48px de alto
Los enlaces tienen espacio suficiente entre sí
El menú hamburguesa abre y cierra correctamente
Todos los enlaces llevan a la página correcta
El menú no tapa el contenido principal al abrirse
```

Abre tu sitio desde el celular ahora mismo y navega por el menú como si fuera la primera vez. Si algo no funciona bien corrígelo antes de publicar porque ese error le está costando posicionamiento al diseño web SEO desde el primer día.



## El footer que fortalece el diseño de tu sitio

![Footer que fortalece el diseño](/assets/blog/footer-que-fortalece-diseno-tu-sitio.jpg "Footer que fortalece el diseño de tu sitio")

El footer es la parte inferior de tu sitio y muchos lo tratan como un relleno. Ese es un error grave. Google rastrea el footer de cada página de tu sitio y lo usa como una señal adicional de confianza y estructura. Un footer bien construido refuerza el diseño web SEO en cada página donde aparece.

Vamos a construirlo correctamente.

---

### Qué debe tener el footer de un diseño web SEO bien ejecutado

Abre el código de tu sitio y revisa qué tiene tu footer ahora mismo. Si solo tiene el copyright y nada más estás desperdiciando un espacio valioso que Google lee en cada página.

Footer mal construido:
```
 2026 Mi sitio web. Todos los derechos reservados.
```

Footer bien construido:
```
Servicios          Empresa            Legal
Diseño Web SEO     Sobre mí           Política de privacidad
Tienda Online      Portafolio         Términos y condiciones
Rediseño Web       Blog               Cookies

Contacto
+57 310 785 1074
contacto@tudominio.com
Colombia, Latinoamérica

 2026 Omar Fuentes - Diseño Web SEO
```

Un footer completo le da a Google enlaces internos adicionales, información de contacto, páginas legales y contexto sobre tu negocio. Todo eso suma para el diseño web SEO.

---

### Construye el footer con etiquetas semánticas correctas

Al igual que el menú el footer debe estar construido con la etiqueta semántica correcta para que Google lo identifique y lo procese bien dentro del diseño web SEO.

Footer mal construido:
```html
<div class="footer">
  <p> 2026 Mi sitio web</p>
</div>
```

Footer bien construido:
```html
<footer>
  <nav aria-label="Footer">
    <ul>
      <li><a href="/servicios/diseno-web-seo">Diseño Web SEO</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/contacto">Contacto</a></li>
      <li><a href="/politica-de-privacidad">Política de privacidad</a></li>
      <li><a href="/terminos-y-condiciones">Términos y condiciones</a></li>
    </ul>
  </nav>
  <p> 2026 Omar Fuentes - Diseño Web SEO en Colombia</p>
</footer>
```

La etiqueta footer le dice a Google exactamente qué es ese bloque. El aria-label le da contexto adicional de accesibilidad que Google también valora positivamente.

---

### Incluye tu información de contacto y ubicación en el footer

Tu footer es el lugar ideal para colocar tu información de contacto y ubicación. Esto refuerza el SEO local del diseño web SEO y le dice a Google en qué mercado operas en cada página de tu sitio.

```html
<footer>
  <address>
    <p>Omar Fuentes - Diseño Web SEO</p>
    <p>Colombia, Latinoamérica</p>
    <p>
      <a href="tel:+573107851074">+57 310 785 1074</a>
    </p>
    <p>
      <a href="mailto:contacto@omarfuentes.com">
        contacto@omarfuentes.com
      </a>
    </p>
  </address>
</footer>
```

La etiqueta address le indica a Google que esa información corresponde a datos de contacto reales. Eso suma puntos al E-E-A-T de tu sitio y fortalece la confianza que Google tiene en el diseño web SEO que estás construyendo.

---

### Lo que nunca debes hacer en el footer

Hay errores comunes en el footer que dañan el diseño web SEO y que debes evitar desde el principio.

No sobrecargues el footer con decenas de enlaces. Google puede interpretarlo como una práctica manipuladora y penalizarte.

```
Malo: 50 enlaces en el footer apuntando a todas las páginas del sitio
Bueno: 8 a 12 enlaces relevantes bien organizados por categoría
```

No coloques texto invisible o keywords ocultas en el footer. Esa práctica está penalizada por Google y puede hacer que tu diseño web SEO pierda posicionamiento de forma severa.

```html
<!-- Esto está penalizado por Google -->
<footer>
  <p style="color: white; font-size: 1px;">
    diseño web seo colombia diseño web posicionamiento 
    seo agencia diseño web
  </p>
</footer>

<!-- Esto es lo correcto -->
<footer>
  <p> 2026 Omar Fuentes - Diseño Web SEO</p>
</footer>
```

Construye el footer pensando siempre en el usuario primero. Si el usuario lo encuentra útil Google también lo va a valorar positivamente para el diseño web SEO de tu sitio.


## Errores que están destruyendo el diseño web SEO de tu sitio

Este es uno de los puntos más importantes de toda la guía. Puedes hacer todo bien pero si cometes alguno de estos errores el diseño web SEO de tu sitio va a sufrir las consecuencias sin que entiendas por qué. Léelos con atención y revisa tu sitio ahora mismo mientras los vas leyendo.

---

### No tener una estructura de H1, H2 y H3 clara

Este error es más común de lo que crees. Muchos sitios tienen dos o tres H1 en la misma página o no usan H2 y H3 para organizar el contenido. Google lee esa jerarquía para entender qué es importante en tu página.

Mal uso de encabezados:
```html
<h1>Bienvenido</h1>
<h1>Nuestros servicios</h1>
<h1>Contáctanos</h1>
```

Uso correcto de encabezados:
```html
<h1>Diseño Web SEO en Colombia</h1>
<h2>Servicios de Diseño Web con Posicionamiento SEO</h2>
<h3>Diseño Web para negocios locales</h3>
<h3>Tiendas online optimizadas para Google</h3>
```

Revisa tu sitio ahora mismo. Solo debe haber un H1 por página y los H2 y H3 deben organizarse de forma lógica hacia abajo.

---

### Tener contenido duplicado en tu sitio

El contenido duplicado es uno de los errores que más daño hace al diseño web SEO. Cuando Google encuentra dos páginas con el mismo contenido no sabe cuál indexar y termina ignorando ambas o eligiendo la que menos te conviene.

Ejemplos de contenido duplicado:
```
tudominio.com/servicios
tudominio.com/servicios/
tudominio.com/?page=servicios
```

Estas tres URLs pueden estar mostrando el mismo contenido y Google las trata como páginas diferentes. Usa la etiqueta canonical para indicarle cuál es la versión correcta.

```html
<link rel="canonical" href="https://tudominio.com/servicios/">
```

---

### No optimizar las imágenes antes de subirlas

Ya te lo expliqué antes pero vale la pena repetirlo porque es uno de los errores más frecuentes. Subir imágenes sin comprimir, sin nombre descriptivo y sin atributo ALT es regalarle puntos a la competencia en el diseño web SEO.

Antes de subir cualquier imagen a tu sitio verifica estos tres puntos:

```
1. El nombre del archivo es descriptivo y tiene la keyword
2. La imagen está comprimida y en formato WebP
3. El atributo ALT describe la imagen con palabras clave naturales
```

Si tienes imágenes subidas que no cumplen esto entra ahora mismo y corrígelas una por una.

---

### Tener páginas sin meta título ni meta descripción

Cada página de tu sitio debe tener su propio title y meta descripción únicos. Si dejas páginas sin estos metadatos Google va a generar uno automáticamente tomando texto aleatorio de tu página y ese resultado no va a estar optimizado para el diseño web SEO.

Entra a cada página de tu sitio y verifica:

```html
<!-- Esto no puede faltar en ninguna página -->
<title>Página descriptiva con keyword | Tu marca</title>
<meta name="description" 
content="Descripción clara de la página entre 150 y 160 caracteres 
que incluya la keyword de forma natural.">
```

Si tienes diez páginas las diez deben tener title y meta descripción únicos y optimizados.

---

### Ignorar la velocidad de carga del sitio

Un sitio lento es un sitio que no posiciona. Si tu diseño web SEO tarda más de tres segundos en cargar estás perdiendo usuarios y posicionamiento al mismo tiempo. Google mide la velocidad en tiempo real y la usa como factor de ranking.

Entra ahora mismo a PageSpeed Insights y analiza tu sitio:

```
pagespeed.web.dev
```

Si tu puntuación en móvil está por debajo de 90 tienes trabajo que hacer. Revisa las imágenes, el código, los scripts y el hosting. Cada segundo que reduces en el tiempo de carga se traduce en más posicionamiento para el diseño web SEO.

---

### No tener tu sitio adaptado para móvil

Ya lo vimos en la sección de responsive pero es tan importante que merece estar también aquí. Si tu sitio no funciona perfectamente en celular Google no lo va a posicionar bien sin importar qué tan bien esté hecho el resto del diseño web SEO.

Abre tu sitio desde el celular ahora mismo y navega por cada página. Verifica que:

```
El texto se lee sin hacer zoom
Los botones son fáciles de presionar con el dedo
Las imágenes se ven correctamente
El menú funciona bien
Los formularios son fáciles de completar
```

Si algo falla en móvil corrígelo antes que cualquier otra cosa.

---

### No actualizar el contenido del sitio

Google premia los sitios que se actualizan constantemente. Un sitio que no publica contenido nuevo ni actualiza sus páginas existentes le dice a Google que está abandonado y eso afecta directamente el diseño web SEO a largo plazo.

Establece un ritmo de publicación en tu blog. No tiene que ser diario. Puede ser un artículo bien escrito por semana o por quincena. Lo importante es la constancia y la calidad del contenido que publicas.

Actualiza también las páginas de servicios cuando cambies algo en tu oferta. Mantener el contenido fresco y relevante es una de las estrategias más efectivas para sostener y mejorar el posicionamiento del diseño web SEO con el tiempo.

---

### No registrar tu sitio en Google Search Console

Este error lo cometen muchos y es imperdonable. Google Search Console es la herramienta gratuita de Google que te dice exactamente cómo está viendo Google tu sitio, qué errores tiene, qué keywords te están generando tráfico y cuántas páginas están indexadas.

Si no tienes tu sitio registrado entra ahora mismo:

```
search.google.com/search-console
```

Agrega tu dominio, verifica la propiedad y envía tu sitemap. Desde ese momento vas a tener visibilidad completa sobre el estado del diseño web SEO de tu sitio directamente desde Google.





## Conclusión

Si llegaste hasta aquí eres de las pocas personas que se toma en serio el diseño web SEO y eso ya te pone un paso adelante de la mayoría.

A lo largo de esta guía cubriste todo lo que necesitas para construir o mejorar un sitio web que posicione en Google de verdad. Desde la elección del dominio hasta los errores que debes evitar, desde la arquitectura de la información hasta los metadatos, el SSL, el footer y cada detalle técnico que Google evalúa para decidir si tu sitio merece estar en las primeras posiciones.

El diseño web SEO no es magia ni suerte. Es trabajo bien hecho desde el principio, con una base sólida, un contenido relevante y una estructura que Google pueda entender y premiar.

Ahora tienes el conocimiento. El siguiente paso es tuyo.

Gracias por leer esta guía hasta el final. Sé que la información que encontraste aquí va a marcar una diferencia real en el diseño web SEO de tu sitio. Si tienes alguna pregunta o necesitas ayuda para aplicar lo que aprendiste, te invito a **[visitar mi página principal](/)** donde encontrarás más recursos y ejemplos prácticos de diseño web SEO.

---

<div style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border-radius: 0.75rem; padding: 1.5rem; margin: 2rem 0; text-align: center;">
  <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 0.75rem;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="margin-right: 0.5rem;">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
    <h4 style="color: white; margin: 0; font-size: 1.25rem; font-weight: 600;">¿Listo para empezar tu proyecto?</h4>
  </div>
  <p style="color: white; margin-bottom: 1rem; font-size: 0.95rem; opacity: 0.9;">Hablemos directamente por WhatsApp sobre tu diseño web SEO</p>
  <a href="https://wa.me/573107851074?text=Hola%20Omar,%20vi%20tu%20artículo%20de%20diseño%20web%20SEO%20y%20quiero%20cotizar%20un%20proyecto" style="background: white; color: #25D366; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-block; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
    CHAT POR WHATSAPP
  </a>
</div>

---

