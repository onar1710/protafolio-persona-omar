---
title: 'LCP No Baja de 2.5s: Los Elementos Invisibles que Google Ignora'
description: 'Tu página carga rápido pero LCP sigue alto. Los navegadores excluyen ciertos elementos como candidatos LCP por opacidad cero, baja entropía y fondos de viewport. Aprende a diagnosticar el LCP real.'
keywords: 'LCP no baja, LCP alto pagina carga rapido, elemento LCP opacidad cero, imagenes baja entropia LCP, LCP candidatos excluidos, diagnosticar LCP real chrome devtools'
relatedGroup: 'etiqueta-1'
pubDate: '2026-05-01T12:00:00-05:00'
heroImageUrl: '/assets/blog/lcp-no-es-tu-imagen-hero-elementos-invisibles-hero.jpg'
---

Has optimizado todo. Las imágenes están comprimidas en WebP, el servidor responde en menos de 200ms, el CDN está configurado y la carga inicial del HTML es impecable. Cuando abres la página en tu navegador, el contenido aparece casi al instante. Pero PageSpeed Insights te dice que el LCP está en 4.2 segundos. Tú la ves rápido, Google dice que es lenta.

Este escenario frustra a desarrolladores front-end todos los días. La página se siente rápida, los usuarios no se quejan, pero la métrica no baja de 2.5 segundos. El problema no es tu servidor ni tus imágenes. El problema es que el navegador eligió un elemento como candidato LCP que no es el que tú crees. Y ese elemento tiene características que lo hacen invisible o irrelevante para la experiencia del usuario, pero no para el algoritmo de medición.

Vamos a desmontar exactamente qué elementos están siendo medidos, por qué el navegador los elige, y cómo diagnosticarlo y corregirlo.

## Cómo el navegador elige el candidato LCP

El Largest Contentful Paint mide el momento en que se renderiza el elemento de contenido más grande dentro del viewport. "Contenido" tiene un significado técnico específico aquí: no es cualquier cosa que se vea en pantalla. El navegador considera solo ciertos tipos de elementos como candidatos válidos:

- Imágenes (incluyendo las dentro de `<picture>` o con `srcset`)
- Elementos de texto con nodos de texto (párrafos, headings, listas, spans)
- Imágenes de fondo cargadas con `background-image` (en algunos navegadores)
- Elementos `<video>` con póster

El navegador rastrea estos elementos a medida que se renderizan y selecciona el de mayor tamaño de pintura como candidato LCP. Si ese candidato tarda en aparecer, tu LCP es alto. Pero aquí es donde se complica: el navegador también **excluye** ciertos candidatos que cumplen criterios específicos. Y si el candidato que tú esperabas fue excluido, el navegador eligió otro que tardó más en cargar.

## Los elementos que Google ignora como candidatos LCP

No todos los elementos visibles son elegibles para LCP. Los navegadores aplican heurísticas de exclusión que eliminan candidatos que, técnicamente, son los más grandes de la página pero no representan contenido real que el usuario necesite ver.

### Opacidad cero

Si un elemento tiene `opacity: 0`, el navegador lo excluye como candidato LCP. Esto tiene sentido desde la perspectiva de la experiencia del usuario: un elemento invisible no contribuye a lo que la persona percibe como "carga completada".

Pero aquí está el problema práctico. Muchos frameworks y bibliotecas de animación aplican `opacity: 0` a elementos como paso inicial de una animación de entrada. El patrón es: el elemento comienza invisible, luego se anima a `opacity: 1` cuando el framework está listo. El desarrollador ve el elemento aparecer con una animación suave y asume que todo está bien. Pero el navegador, durante la medición inicial, vio ese elemento con opacidad cero y lo excluyó como candidato.

Si el elemento de texto o imagen más grande de tu página estaba animado con opacidad cero al inicio, el navegador buscó el siguiente candidato más grande. Ese siguiente candidato puede ser un elemento más pequeño que tardó más en cargarse, resultando en un LCP alto que no refleja lo que el usuario experimenta.

El caso más común es con bibliotecas como Framer Motion, GSAP o AOS (Animate On Scroll). El contenido principal de la página (tu hero section con el heading H1) tiene una animación de fade-in. El navegador lo ignora como candidato LCP porque estaba en opacidad cero al momento de la primera pintura. El candidato que queda es quizás un banner secundario o una imagen de fondo que tardó más en descargarse.

### Imágenes de baja entropía

Este es uno de los criterios menos conocidos y más confusos. Los navegadores excluyen imágenes con **baja entropía** como candidatos LCP. La entropía, en este contexto, mide la complejidad visual de una imagen: cuánta variación de color y contraste tiene.

Imágenes con baja entropía incluyen:

- Fondos de color sólido o degradados simples
- Imágenes casi uniformes (por ejemplo, un cielo azul sin nubes)
- Imágenes con muy poca variación de píxeles
- Capturas de pantalla de aplicaciones con grandes áreas en blanco

El navegador usa un cálculo interno para determinar si una imagen tiene suficiente complejidad visual para ser considerada "contenido real". Si la entropía está por debajo de un umbral, la imagen se descarta como candidato, aunque sea la imagen más grande de la página.

Esto causa confusión frecuente en sitios que usan hero images con fondos minimalistas. Un desarrollador pone una imagen de 1200x600 como hero, pero esa imagen es mayoritariamente un degradado suave con un logo pequeño en el centro. El navegador la descarta por baja entropía y busca otro candidato. Si el siguiente candidato es un bloque de texto grande que se renderiza después de cargar una fuente web, el LCP se dispara.

### Fondos de viewport completo

Las imágenes de fondo aplicadas con CSS `background-image` tienen un tratamiento especial. Aunque algunos navegadores las consideran como candidatos LCP, excluyen las que cubren todo el viewport o casi todo el viewport cuando no tienen contenido de texto encima.

La razón es que una imagen de fondo de pantalla completa, sin contenido superpuesto, se interpreta más como decoración que como contenido. Si tu hero section es una imagen de fondo a pantalla completa con un heading encima, el candidato LCP debería ser el heading, no la imagen. Pero si el heading tarda en renderizarse (por ejemplo, porque carga una fuente web), el LCP se mide por el momento en que el heading aparece, no por el momento en que la imagen de fondo se cargó.

### Elementos fuera del viewport inicial

Solo los elementos visibles en el viewport durante la carga inicial son candidatos. Si tu imagen hero es enorme pero está parcialmente fuera de la pantalla (por ejemplo, porque hay un header fixed que empuja el contenido hacia abajo), el navegador puede no considerarla como el candidato principal.

Esto es especialmente problemático en móviles, donde el viewport es más pequeño y los elementos que están "justo debajo del pliegue" quedan fuera de la medición.

## Por qué tu LCP es alto si la página carga rápido: los candidatos excluidos

Ahora que entiendes los criterios de exclusión, el escenario del principio tiene sentido. Si te preguntas por qué tu LCP es alto si carga rápido, la respuesta está en los candidatos excluidos por Google. Tu página carga rápido visualmente porque el contenido que tú ves (el hero image, el heading) aparece pronto. Pero el navegador no está midiendo ese elemento. Está midiendo otro candidato que tardó más.

Las razones más comunes por las que el candidato LCP no es el que esperas:

**Tu framework aplicó opacidad cero al hero.** React, Vue o Angular hicieron un SSR (server-side rendering) inicial donde el componente hero apareció con `opacity: 0` para una animación. El navegador lo excluyó. El candidato LCP pasó a ser otra cosa.

**Tu hero image tiene baja entropía.** Es una imagen grande pero visualmente simple. El navegador la descartó y eligió un bloque de texto que se renderizó después de cargar una fuente web.

**Tu fuente web bloqueó la renderización del texto.** El heading principal es técnicamente el candidato LCP, pero la fuente web tardó 1.5 segundos en descargarse. Durante ese tiempo, el texto estaba oculto (gracias a `font-display: block` o un FOIT). El LCP se midió cuando el texto finalmente se hizo visible, no cuando el HTML llegó.

**Un script bloqueó la renderización del candidato.** Un JavaScript en el `<head>` sin `defer` ni `async` bloqueó el parser del navegador. El candidato LCP no se renderizó hasta que ese script terminó de ejecutarse.

## Cómo diagnosticar el LCP real con Chrome DevTools

No adivines. Mide qué elemento exacto es tu candidato LCP.

### Método 1: Performance Panel en Chrome DevTools

1. Abre Chrome DevTools (F12)
2. Ve a la pestaña **Performance**
3. Haz clic en el ícono de recargar (o presiona Ctrl+Shift+E)
4. Espera a que termine la grabación
5. En el timeline, busca la marca **LCP** (aparece como una línea con el texto "LCP")
6. Haz clic en esa marca. DevTools te muestra **exactamente qué elemento** fue el candidato LCP, su selector CSS y cuánto tardó en renderizarse.

Si el elemento que aparece no es el que esperabas, ya sabes dónde está el problema.

### Método 2: Consola con la Performance API

Abre la consola de Chrome y ejecuta:

```javascript
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP element:', lastEntry.element);
  console.log('LCP time:', lastEntry.startTime);
  console.log('LCP URL:', lastEntry.url || 'text element');
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

Esto te muestra en tiempo real qué elemento el navegador está considerando como candidato LCP. Recarga la página y revisa la consola.

### Método 3: Lighthouse con detalle de elementos

En PageSpeed Insights, expande la sección de **Largest Contentful Paint Element** en los diagnósticos. Ahí te dice qué elemento fue medido y, si fue excluido, por qué.

### Método 4: Web Vitals extension

Instala la extensión **Web Vitals** de Chrome. Cuando cargues tu página, te muestra el elemento LCP directamente en la interfaz, junto con el tiempo y el tipo de elemento.

## Soluciones específicas para cada escenario

### Si el candidato LCP es un elemento con opacidad cero

Elimina la animación de opacidad inicial del candidato LCP. Si necesitas la animación, aplica `opacity: 1` al elemento inicialmente y solo anima elementos secundarios. Alternativamente, usa `will-change: opacity` solo después de que el elemento ya se haya renderizado.

Si usas un framework con animaciones de entrada, configura el componente hero para que se renderice sin animación inicial. Las animaciones deben ser progresivas (aparecen después de la carga), no obstructivas (retrasan la carga visual).

### Si el candidato LCP es una imagen de baja entropía

Añade complejidad visual real a la imagen. No se trata de añadir ruido artificial, sino de que la imagen tenga contenido visual relevante: texto, personas, productos, elementos con contraste. Una imagen de hero con una foto de producto real siempre tendrá más entropía que un degradado abstracto.

Si la imagen de fondo debe ser simple, asegúrate de que el texto superpuesto sea el candidato LCP real. Para ello, el texto debe renderizarse rápido (sin bloqueo de fuente web largo) y sin `opacity: 0` inicial.

### Si la fuente web bloquea la renderización del texto

Configura `font-display: swap` en tu CSS. Esto permite que el navegador muestre el texto inmediatamente con una fuente de respaldo y luego cambie a la fuente web cuando se descargue. El LCP se mide con el primer renderizado visible, no con el cambio de fuente.

```css
@font-face {
  font-family: 'MiFuente';
  src: url('/fonts/mifuente.woff2') format('woff2');
  font-display: swap;
}
```

Con `font-display: swap`, el heading se muestra inmediatamente con la fuente del sistema. El LCP se registra en ese momento, no cuando la fuente web termina de cargar.

### Si un script bloqueó la renderización

Mueve los scripts no críticos al final del `<body>` o añade `defer` o `async`. Los scripts en el `<head>` sin estos atributos bloquean el parser HTML y retrasan la renderización de todos los elementos posteriores.

```html
<!-- Mal: bloquea el parser -->
<script src="/js/analytics.js"></script>

<!-- Bien: no bloquea -->
<script src="/js/analytics.js" defer></script>
```

### Si el candidato LCP está fuera del viewport en móvil

Revisa el tamaño del header fijo y los elementos que empujan el contenido hacia abajo. Si tu header tiene `height: 80px` en móvil, tu hero content empieza a pintarse 80px más abajo del viewport. Reduce el tamaño del header en móvil o ajusta el padding superior del contenido.

## El truco del preconnect y preload para el candidato LCP

Una vez que sabes cuál es tu candidato LCP real (no el que tú crees), puedes optimizar su carga específica.

Si el candidato es una imagen, añade un preload:

```html
<link rel="preload" as="image" href="/images/hero.webp" fetchpriority="high">
```

Si el candidato es un bloque de texto que depende de una fuente web, precarga la fuente:

```html
<link rel="preload" as="font" href="/fonts/mifuente.woff2" type="font/woff2" crossorigin>
```

Si el candidato depende de contenido de un servidor externo (CDN, API), establece la conexión temprana:

```html
<link rel="preconnect" href="https://tucdn.com">
```

El atributo `fetchpriority="high"` es especialmente útil. Le dice al navegador que esa imagen tiene prioridad sobre las demás. Si tu candidato LCP es una imagen, este atributo puede reducir el LCP entre 200ms y 500ms.

## Conclusión

El LCP no mide qué tan rápido carga tu página. Mide qué tan rápido se renderiza el elemento de contenido más grande que el navegador eligió como candidato. Y ese candidato puede no ser el que tú esperas.

Los elementos con opacidad cero, las imágenes de baja entropía, los fondos de viewport completo y los textos bloqueados por fuentes web son candidatos que el navegador excluye o que retrasan la medición. Si no sabes qué elemento está siendo medido, estás optimizando a ciegas.

Diagnostica con Chrome DevTools, identifica el candidato real, y optimiza ese elemento específico. No optimices la imagen hero si el navegador no la está midiendo. No comprimas más las imágenes si el problema es una fuente web que bloquea el texto. El diagnóstico correcto es el 80% de la solución.

## Preguntas frecuentes

### ¿Por qué mi LCP no baja de 2.5 segundos si mi página carga rápido?

Porque el navegador probablemente eligió un candidato LCP diferente al que tú ves como "el contenido principal". Usa Chrome DevTools (pestaña Performance) para identificar qué elemento exacto está siendo medido. Puede ser un bloque de texto que espera una fuente web, una imagen que fue excluida por baja entropía, o un elemento que tenía opacidad cero al inicio.

### ¿Qué es un elemento LCP con opacidad cero?

Es un elemento que estaba invisible (`opacity: 0`) cuando el navegador evaluó los candidatos LCP. Los frameworks de animación frecuentemente aplican opacidad cero como estado inicial para animaciones de entrada. El navegador excluye estos elementos como candidatos y busca el siguiente más grande, que puede tardar más en renderizarse.

### ¿Cómo sé qué imagen es mi candidato LCP real?

Usa el panel Performance de Chrome DevTools, ejecuta la Performance API en consola (`largest-contentful-paint` observer) o instala la extensión Web Vitals. Cualquiera de estos métodos te muestra el selector CSS exacto del elemento que Google está midiendo como LCP.

### ¿Las imágenes de fondo cuentan para LCP?

Depende. Los navegadores pueden considerar `background-image` como candidato LCP, pero excluyen las que cubren todo el viewport sin contenido de texto superpuesto. Si tu hero es solo una imagen de fondo sin texto encima, el candidato LCP probablemente sea otro elemento.

### ¿Qué es la entropía de una imagen en el contexto de LCP?

La entropía mide la complejidad visual de una imagen (variación de color, contraste, detalle). Los navegadores excluyen imágenes con baja entropía como candidatos LCP porque se consideran decorativas, no contenido real. Fondos de color sólido, degradados simples y cielos vacíos son ejemplos de baja entropía.

### ¿Cambiar a font-display: swap afecta el diseño?

Puede causar un cambio visual (FOUT: Flash of Unstyled Text) cuando la fuente web se descarga y reemplaza la fuente del sistema. Pero este cambio visual es menor comparado con el beneficio de que el texto sea visible inmediatamente. Para el LCP, `font-display: swap` es casi siempre la opción correcta porque permite que el candidato de texto se renderice sin esperar la descarga de la fuente.
