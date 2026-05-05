---
title: 'Bootstrap Completo Para 3 Clases Css: El Peso Que No Ves'
description: 'Bootstrap pesa 220KB minificado y Tailwind sin purge puede generar 3MB de CSS. Identifica el CSS sobrante en tu proyecto, haz tree-shaking manual y mide el impacto real en LCP con pasos concretos.'
keywords: 'bootstrap hace mi web lenta, reducir css innecesario web, tailwind css tamaño archivo grande, dependency bloat desarrollo web, css sobrante impacto rendimiento, optimizar bootstrap solo usar lo necesario'
relatedGroup: 'frameworks'
pubDate: '2026-05-05T12:00:00-05:00'
heroImageUrl: '/assets/blog/instalaste-bootstrap-completo-para-usar-3-clases-css-hero.jpg'
---

Un proyecto nuevo. Un deadline ajustado. La tentación de instalar Bootstrap porque container, row y col-6 resuelven el layout en minutos. El npm install, el import en el CSS principal, el layout funciona perfecto, el cliente satisfecho. Lo que nadie te cuenta es que Bootstrap completo trae consigo más de 220 kilobytes de CSS minificado, y tú estás usando tal vez 15 de esas reglas. Ese exceso no es un detalle técnico menor. Cada kilobyte de CSS que el navegador debe descargar, parsear y aplicar antes de que la página sea visible tiene un costo directo en el tiempo que un usuario espera viendo una pantalla en blanco.

Si eres desarrollador junior, recién saliste de un bootcamp o estás construyendo tu primer sitio freelance, lo que sigue te va a mostrar por qué instalar frameworks CSS completos para usar una fracción mínima de sus clases es uno de los errores de rendimiento más comunes y más fáciles de evitar.

## El peso real de Bootstrap en tu proyecto

Cuando ejecutas npm install bootstrap, el paquete completo incluye el CSS normalizado, el grid system, todo el sistema de utilidades, componentes como modals, dropdowns, carousels, toasts, offcanvas, navbars, forms, alerts, badges y decenas de elementos que probablemente nunca vas a usar en tu proyecto. Minificado y comprimido, ese CSS pesa aproximadamente 220KB. Comprimido con gzip, baja a alrededor de 27KB. Ese número final puede parecer pequeño, pero no es el tamaño del archivo lo que importa. Es lo que el navegador tiene que hacer con ese archivo antes de que el usuario vea algo.

El navegador no puede comenzar a renderizar la página hasta que haya descargado y parseado todos los CSS que afecten los elementos visibles. Si tu CSS está en un solo archivo monolítico, el navegador debe descargar las 220KB, parsear cada regla, construir el árbol de estilo y solo entonces aplicar los estilos a los elementos del DOM. Mientras eso ocurre, el usuario ve una pantalla blanca o parcialmente renderizada. A eso se le llama CSS blocking render y es una de las principales causas de un LCP alto en páginas que usan frameworks CSS completos.

Para dimensionar el problema: un framework CSS como Pico CSS pesa 10KB minificado. Tailwind CSS purgado para un sitio promedio genera entre 5KB y 15KB. Bootstrap completo es 22 veces más grande que Pico y potencialmente 40 veces más grande que un Tailwind correctamente configurado. La diferencia no es estética ni de funcionalidad. Es de rendimiento puro.

## Dependency bloat: el problema que no ves en package.json

El concepto de dependency bloat se refiere a la acumulación de código no utilizado que viaja con las dependencias de tu proyecto. No es exclusivo de CSS, pero en las hojas de estilo es donde el impacto es más visible porque el CSS es render-blocking por naturaleza.

Un desarrollador junior instala Bootstrap para usar container, row, col-md-6 y quizás p-3 o text-center. Eso representa menos del 10% del framework completo. El otro 90% son reglas CSS que el navegador debe parsear, memorizar en el CSSOM y nunca aplicar a ningún elemento porque esos elementos no existen en tu HTML.

Tailwind presenta un problema diferente pero igualmente grave. Sin una configuración de purge (ahora llamada content scanning en Tailwind v3+), el archivo CSS generado contiene todas las clases utilitarias de Tailwind, más de 3,000 clases. Ese archivo puede superar los 3 megabytes sin minificar. Tailwind v3 resuelve esto automáticamente si lo configuras correctamente, pero muchos desarrolladores instalan Tailwind sin revisar la configuración de purgado y terminan con un CSS gigante que incluye clases que nunca usan.

El patrón es el mismo en ambos casos: instalas un paquete grande para usar una porción pequeña, y el exceso se convierte en peso muerto que afecta tu rendimiento.

## Cómo medir cuánto CSS sobra en tu proyecto

Antes de optimizar necesitas datos concretos. No se trata de adivinar cuánto CSS sobra. Se trata de medir exactamente qué reglas se están usando y cuáles no.

### Coverage en Chrome DevTools

Abre Chrome DevTools, ve a la pestaña Coverage y carga tu página. La herramienta te muestra un gráfico con tres zonas: el tamaño total del CSS descargado, la porción que se usa cuando la página carga y la porción que nunca se usa. Si Bootstrap está cargado completo, verás que entre el 85% y el 95% del CSS no se aplica a ningún elemento visible.

Haz clic en el archivo CSS para ver el detalle línea por línea. Las líneas en rojo son las que no se usan. Las líneas en verde son las que sí se aplican. Si la mayoría del archivo está en rojo, tienes confirmación visual de que estás cargando CSS innecesario.

### PurgeCSS

PurgeCSS es una herramienta que analiza tu HTML, tus componentes JavaScript y cualquier template que uses, y elimina del CSS todas las clases que no aparecen referenciadas. Funciona como un tree-shaking para CSS.

Para ejecutarlo, instala PurgeCSS como dependencia de desarrollo:

```bash
npm install -D purgecss
```

Luego ejecútalo contra tu proyecto:

```bash
purgecss --css dist/styles.css --content "src/**/*.html" "src/**/*.jsx" --output dist/
```

El resultado es un archivo CSS drásticamente más pequeño. Si usas Bootstrap completo con 220KB y solo 10 clases visibles en tu HTML, PurgeCSS puede reducir ese archivo a menos de 5KB. La diferencia de tamaño es abismal y el efecto en el rendimiento es inmediato.

### La métrica de CSS

Lighthouse en Chrome DevTools te muestra el diagnóstico "Reduce unused CSS" con el tamaño exacto del CSS que podrías eliminar. También te muestra el impacto estimado en el tiempo de carga. Si tu diagnóstico de Lighthouse muestra que puedes eliminar más de 100KB de CSS, estás cargando código que afecta directamente tu LCP.

## Tree-shaking manual para Bootstrap

Si decides seguir usando Bootstrap porque necesitas componentes específicos como modals o navbars, no necesitas cargar el framework completo. Bootstrap está diseñado para ser importado modularmente, pero muchos desarrolladores no saben cómo hacerlo.

En lugar de importar todo el CSS de Bootstrap, importa solo los módulos que necesitas. Si solo usas el grid system y utilidades básicas, tu import se ve así:

```css
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/grid";
@import "~bootstrap/scss/utilities";
```

Eso importa las funciones de Sass necesarias, las variables, los mixins del grid, el sistema de columnas y las utilidades básicas. El resultado es un archivo CSS que pesa entre 15KB y 30KB en lugar de 220KB. Si además necesitas solo un componente específico como buttons, agrégalo al import. Cada módulo está diseñado para ser independiente.

Si usas Bootstrap v5, también puedes configurar Sass para personalizar las variables antes de compilar. Desactiva los componentes que no necesitas ajustando las variables de habilitación en tu archivo _variables.scss. Eso reduce aún más el CSS final.

Para Tailwind, el tree-shaking se configura en tailwind.config.js. Asegúrate de que la propiedad content apunte a todos los archivos donde usas clases de Tailwind:

```javascript
module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

Con esta configuración, Tailwind v3 genera automáticamente un CSS que contiene solo las clases que aparecen en tus archivos fuente. Si Tailwind genera un archivo mayor a 50KB, significa que estás usando muchas clases o que la configuración de content no está apuntando correctamente a tus archivos.

## El impacto medible en LCP y en la experiencia del usuario

El Largest Contentful Performance mide cuánto tiempo tarda el elemento más grande de la página en ser visible. Si el CSS render-blocking descarga 220KB antes de que el navegador pueda renderizar, el LCP se retrasa proporcionalmente. En una conexión 3G promedio, 220KB de CSS comprimido tardan aproximadamente 2 segundos en descargar. Añade el tiempo de parse y tienes un retraso de 2.5 a 3 segundos solo por el CSS.

Para un sitio que carga una imagen hero como elemento LCP, el navegador no puede comenzar a renderizar esa imagen hasta que haya descargado y parseado el CSS que afecta su posicionamiento y tamaño. Si el CSS es más grande de lo necesario, el usuario espera más tiempo viendo una pantalla blanca antes de ver contenido.

La diferencia entre cargar Bootstrap completo (220KB) y una versión tree-shaked (20KB) en una conexión 3G es aproximadamente 1.8 segundos de ahorro en descarga y parse. Para un LCP que idealmente debería estar por debajo de 2.5 segundos, 1.8 segundos es la diferencia entre un buen score y uno malo.

Los desarrolladores front-end miden el impacto de sus decisiones en las métricas de rendimiento porque eso se traduce directamente en experiencia de usuario. Cada framework CSS que instalas sin verificar su peso contribuye al problema. No es cuestión de rechazar frameworks. Es cuestión de entender cuánto de lo que instalas realmente necesitas y cuánto estás pagando en rendimiento por conveniencia.

## Estrategias prácticas según tu caso

### Sitio estático simple con HTML y CSS puro

No necesitas Bootstrap ni Tailwind para un sitio de una página o un portafolio. Un CSS personalizado de 5KB puede cubrir el layout completo con flexbox o grid. Si necesitas una guía de estilos rápida, considera Pico CSS (10KB), Milligram (2KB) o incluso Open Props que te da variables CSS customizables sin generar reglas nuevas.

### Proyecto React o Vue con componentes reutilizables

Si usas un framework de JavaScript, Tailwind con la configuración correcta de content es la opción que mejor balancea funcionalidad y rendimiento. Genera solo las clases que usas, integra perfectamente con los sistemas de componentes y su purge automático evita el dependency bloat.

### Proyecto Bootstrap legacy que no puedes reescribir

Migra gradualmente. Identifica las páginas con más tráfico, aplica tree-shaking modular a esos templates y deja el CSS completo solo en las páginas que realmente usan la mayoría de los componentes. La migración no tiene que ser total para generar impacto.

### Landing pages y campañas de marketing

Cada kilobyte cuenta. Usa CSS custom o un micro-framework. Las landing pages dependen del LCP para conversiones y cada segundo de carga perdido reduce la tasa de conversión. Un estudio de Google mostró que un retraso de un segundo en mobile reduce las conversiones hasta un 20%.

## Lo que deberías verificar antes de instalar un framework CSS

Antes de npm install, abre la documentación del framework que estás considerando y busca el tamaño del paquete. Los frameworks modernos muestran su tamaño minificado y comprimido en sus sitios oficiales. Compara ese número con lo que realmente necesitas. Si vas a usar 5 clases, un framework de 220KB no es la herramienta correcta. No porque sea malo técnicamente, sino porque el costo en rendimiento no justifica la conveniencia.

La industria del desarrollo web tiene un problema de dependency bloat que va más allá del CSS. Los frameworks de JavaScript, las librerías de utilidad y los paquetes de iconos contribuyen al mismo patrón: instalar demasiado para usar muy poco. Pero el CSS es donde el impacto es más directo y medible porque es render-blocking. Resolver el problema empieza por ser consciente de cuánto estás cargando y por preguntarte si cada kilobyte del paquete que instalas realmente está siendo utilizado.

## Preguntas frecuentes

**¿Puedo usar Bootstrap solo para el grid system y ignorar el resto del CSS?**

Sí, y esa es la recomendación si solo necesitas el layout. Importa selectivamente los módulos de Sass de Bootstrap: functions, variables, mixins, grid y utilidades. El archivo resultante pesa entre 15KB y 30KB en lugar de 220KB. La documentación de Bootstrap v5 detalla exactamente qué módulos necesitas importar para cada funcionalidad.

**¿Tailwind v3 ya resuelve el problema del CSS gigante automáticamente?**

Tailwind v3 escanea tus archivos fuente automáticamente basándose en la configuración de content y genera un CSS que contiene solo las clases utilizadas. Sin embargo, necesitas verificar que la configuración de content apunte correctamente a todos los archivos donde usas clases de Tailwind. Si apunta a archivos incorrectos o no apunta a algunos archivos, el CSS generado puede contener clases innecesarias o faltar clases que necesitas.

**¿Cuánto CSS es aceptable para un sitio web promedio?**

Un sitio bien optimizado debería cargar entre 5KB y 30KB de CSS comprimido para la carga inicial. Más de 50KB comprimido indica que probablemente estás cargando código no utilizado. Más de 100KB comprimido es una señal clara de dependency bloat que está afectando tu rendimiento medible.

**¿El CSS modular con @import reduce el rendimiento en producción?**

En producción, el CSS modular debe ser compilado en un solo archivo minificado. Los @import múltiples son para el desarrollo, no para el envío final al navegador. Herramientas como Sass, PostCSS o el bundler de tu framework (Webpack, Vite, esbuild) se encargan de consolidar todos los imports en un archivo optimizado.

**¿Cuál es la diferencia entre tree-shaking manual y usar PurgeCSS?**

El tree-shaking manual implica importar selectivamente los módulos del framework que necesitas, controlando qué entra al CSS desde el inicio. PurgeCSS analiza el CSS resultante y elimina las reglas que no se usan en tu HTML. Ambas técnicas son complementarias: el tree-shaking reduce el CSS que generas y PurgeCSS elimina lo que sobra después. Usar ambos en conjunto produce los resultados más agresivos de reducción de tamaño.