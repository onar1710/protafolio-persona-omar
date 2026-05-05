---
title: 'Percentil 75 vs 95: Tu Web Pasa CWV pero Pierde Clientes'
description: 'Google usa el percentil 75 para evaluar Core Web Vitals, pero el 25% restante de tus usuarios tiene experiencias que destruyen conversiones. Cómo medir y optimizar para el percentil 95.'
keywords: 'percentil 75 core web vitals problema, 25% usuarios experiencia mala, optimizar percentil 95 web, core web vitals pasan pero usuarios se quejan, medir experiencia real todos los usuarios, percentil 75 vs percentil 95 rendimiento'
relatedGroup: 'etiqueta-1'
pubDate: '2026-05-02T12:00:00-05:00'
heroImageUrl: '/assets/blog/trampa-percentil-75-core-web-vitals-hero.jpg'
---

Tu equipo de producto está celebrando. Google Search Console muestra todas las URLs en verde. Las Core Web Vitals pasan el test. PageSpeed Insights da el visto bueno. El dashboard de rendimiento dice que todo está bien. Pero hay un problema: los usuarios se quejan. La tasa de rebote no baja. Las conversiones están estancadas. El equipo de soporte recibe mensajes de personas que dicen que la web "va lenta" o que "no les funciona".

¿Cómo puede ser? Las métricas están en verde. Google dice que la web es buena. Pero los datos de negocio cuentan otra historia.

La respuesta está en una cifra que Google no muestra por defecto y que la mayoría de product managers y especialistas en CRO nunca revisan: el percentil 75. Ese es el umbral que Google usa para decidir si tu web pasa o no el test. Y es una trampa, porque si el percentil 75 está dentro de los umbrales, el otro 25% de tus usuarios puede estar teniendo una experiencia devastadora que Google ignora por completo.

## Qué es el percentil 75 y por qué Google lo eligió

Cuando Google dice que tu LCP es "2.1 segundos", no está diciendo que todos tus usuarios experimentan 2.1 segundos. Está diciendo que el 75% de tus usuarios experimentan 2.1 segundos o menos. El percentil 75 (p75) es el valor por debajo del cual se encuentra el 75% de las mediciones.

Google eligió el p75 como umbral porque estadísticamente representa una experiencia "típica" sin ser distorsionada por valores extremos. Si usara el promedio (percentil 50), un sitio con muchos usuarios rápidos y unos pocos extremadamente lentos podría verse bien en promedio mientras una fracción significativa sufre. Si usara el percentil 95, casi ningún sitio pasaría el test.

El p75 es un compromiso razonable desde la perspectiva de Google, que necesita un estándar aplicable a millones de sitios. Pero desde la perspectiva de un negocio que depende de conversiones, el p75 tiene un problema serio: ignora al 25% de los usuarios que están teniendo la peor experiencia.

## El percentil 75 de Core Web Vitals: el problema real

Vamos con números concretos. Imagina que tu ecommerce tiene estos datos:

- LCP p75: 2.3 segundos (Good, por debajo de 2.5s)
- INP p75: 180ms (Good, por debajo de 200ms)
- CLS p75: 0.08 (Good, por debajo de 0.1)

Todo en verde. Google está contento. Pero ahora mira los percentiles superiores:

- LCP p90: 5.1 segundos
- INP p90: 620ms
- CLS p90: 0.32

El 10% más lento de tus usuarios está esperando más de 5 segundos para ver el contenido principal. Las interacciones tardan más de 600ms en responder. El layout se mueve tanto que los usuarios pierden el botón que querían tocar. Ese 10% no son usuarios hipotéticos. Son personas reales que están intentando comprar en tu tienda y no pueden.

Ahora amplía la lente. Si el p90 ya es devastador, el percentil 95 es peor. Y el percentil 99, que representa a 1 de cada 100 usuarios, puede tener tiempos de carga de 8 a 12 segundos. Esos usuarios no esperan. Se van. Y tú nunca los ves en tus métricas de conversión porque no convirtieron.

## Por qué el 25% que Google ignora es el que más dinero te cuesta

Hay una paradoja en el comportamiento de los usuarios web que los product managers rara vez consideran: los usuarios que experimentan los tiempos de carga más lentos son, en muchos casos, los mismos que tienen mayor intención de compra.

¿Por qué? Porque son usuarios que están en dispositivos más lentos o conexiones más inestables. En mercados emergentes (Latinoamérica, Sudeste Asiático, partes de África y Europa del Este), la proporción de usuarios con dispositivos de gama media-alta y conexiones 4G estables es menor. La mayoría accede desde dispositivos con 2 o 3 GB de RAM y conexiones que fluctúan entre 3G y 4G.

Cuando tu sitio carga en 2.1 segundos para alguien con un iPhone de última generación y fibra óptica, carga en 6 segundos para alguien con un Android de gama media y una conexión inestable. Ambos son tus usuarios. Ambos quieren comprar. Pero el segundo tiene 3 veces más probabilidades de abandonar.

Un estudio de conversión de ecommerce muestra que cada segundo adicional de carga reduce la tasa de conversión entre un 4% y un 7%. Si tu p75 es 2.3 segundos y tu p90 es 5.1 segundos, el 10% más lento de tus usuarios está experimentando 2.8 segundos adicionales. Eso es entre un 11% y un 20% menos de conversiones para ese segmento. Si ese 10% representa el 10% de tus ingresos, estás perdiendo entre un 1% y un 2% de ingresos totales por no optimizar más allá del p75.

Para un ecommerce que factura 50,000 dólares al mes, ese 1-2% son 500 a 1,000 dólares mensuales. No es catastrófico, pero es dinero que se va todos los meses sin que tus métricas de Google te lo digan.

## Core Web Vitals pasan pero usuarios se quejan: el diagnóstico

Si tu equipo de soporte recibe quejas de rendimiento pero tus Core Web Vitals están en verde, el diagnóstico es casi siempre el mismo: el percentil 75 oculta el problema del 25% restante.

Los síntomas típicos:

- Usuarios reportan que "la página se congela" al hacer clic en botones (INP alto en p90+)
- Usuarios dicen que "todo se mueve" cuando intentan hacer algo (CLS alto en p90+)
- Usuarios mencionan que "tarda mucho en cargar" a pesar de que tú la ves rápido (LCP alto en p90+)
- La tasa de conversión en móvil es significativamente menor que en desktop, a pesar de que las métricas están verdes en ambos

Estos síntomas no aparecen en PageSpeed Insights ni en Search Console. Aparecen en los datos de tu analytics, en tu tasa de rebote segmentada por dispositivo, en los mensajes de soporte y en los comentarios de usuarios reales.

## Cómo medir la experiencia real de todos tus usuarios

No puedes optimizar lo que no mides. Y el percentil 75 de Google solo te muestra la punta del iceberg.

### Consulta percentiles superiores en CrUX

CrUX (Chrome User Experience Report) tiene datos de más percentiles, no solo el p75. Puedes consultarlos a través de la API de CrUX o del CrUX Dashboard en Looker Studio.

Configura un dashboard que muestre p50, p75, p90 y p95 para LCP, INP y CLS. Si la diferencia entre p75 y p90 es más del 50%, tienes un segmento significativo de usuarios con experiencia mala que el p75 oculta.

### Implementa Real User Monitoring (RUM)

Las herramientas de RUM miden la experiencia de cada usuario individual, no una muestra agregada. SpeedCurve, New Relic Browser, Datadog RUM y Sentry Performance son opciones que te dan datos granulares con percentiles personalizados, segmentación por dispositivo, conexión y geografía.

Con RUM puedes filtrar específicamente por el percentil que te interesa. ¿Qué dispositivos están en el p90 de LCP? ¿Qué países concentran el p95 de INP? ¿Qué páginas tienen la mayor brecha entre p75 y p95?

### Segmenta Google Analytics por velocidad

Si no tienes presupuesto para una herramienta de RUM, puedes usar Google Analytics para obtener señales indirectas. Segmenta por tipo de dispositivo, país y conexión. Compara la tasa de conversión entre dispositivos de gama alta y gama baja. Si la diferencia es enorme, tus métricas de p75 no están representando a todos tus usuarios.

También puedes usar el Web Vitals Report de Google Analytics 4, que te permite crear audiencias basadas en métricas de rendimiento y comparar el comportamiento de usuarios con buena experiencia versus mala experiencia.

### Usa la extensión Web Vitals en dispositivos reales

Pide a testers o compañeros que usen dispositivos de gama media (no los últimos modelos) y que prueben tu sitio con conexiones normales (no WiFi de oficina). La extensión Web Vitals de Chrome les mostrará las métricas reales que experimentan. Si esos valores están muy por encima de los que tú ves en tu equipo, ya tienes la confirmación.

## Optimizar para el percentil 95: estrategia práctica

Optimizar para el p95 no significa reescribir tu sitio. Significa atacar los puntos específicos que afectan más a los usuarios lentos.

### Reduce el tamaño del JavaScript total

Los usuarios con dispositivos lentos sufren más con JavaScript porque el navegador tarda más en parsearlo y ejecutarlo. Lo que en un iPhone de última generación toma 50ms, en un Android de gama baja toma 400ms.

Revisa tu bundle de JavaScript. Elimina código que no necesitas en la carga inicial. Divide el JavaScript en chunks que se carguen bajo demanda. Usa `defer` para scripts no críticos. Cada KB de JavaScript que eliminas tiene un impacto desproporcionado en dispositivos lentos.

### Implementa un font-display agresivo

Las fuentes web bloquean la renderización del texto en dispositivos lentos. Configura `font-display: swap` para todas tus fuentes. Esto permite que el texto se muestre inmediatamente con la fuente del sistema y cambie a la fuente web cuando se descargue.

Para el p95, la diferencia entre `font-display: block` y `font-display: swap` puede ser de 2 a 4 segundos en LCP. Los usuarios de dispositivos rápidos no notan la diferencia. Los de dispositivos lentos la sufren.

### Preload los recursos críticos

Los usuarios con conexiones lentas pierden más tiempo en cada petición de red. Si tu LCP depende de una imagen y esa imagen es el décimo recurso que el navegador descarga, el usuario lento espera mucho más.

Añade `<link rel="preload">` para el recurso crítico del LCP. Usa `fetchpriority="high"` para la imagen principal. Estas directivas le dicen al navegador que descargue ese recurso antes que los demás, reduciendo el tiempo de espera para todos los usuarios pero beneficiando desproporcionadamente a los más lentos.

### Reduce el layout shift en interacciones

El CLS alto en percentiles superiores frecuentemente viene de popups, banners de cookies, anuncios y widgets de terceros que aparecen después de la carga inicial. Estos elementos empujan el contenido y destruyen la experiencia de usuarios que están intentando interactuar.

Define dimensiones explícitas para todos los contenedores de contenido dinámico. Retrasa la aparición de popups hasta después de la primera interacción del usuario. Elimina anuncios que causan layout shift.

### Implementa service worker para recursos estáticos

Un service worker puede cachear los recursos estáticos de tu sitio (CSS, JS, imágenes, fuentes) en el dispositivo del usuario. En la segunda visita, estos recursos se sirven desde la caché local en menos de 10ms, sin importar la velocidad de la conexión.

Para el p95, un service worker es transformador. Los usuarios con conexiones lentas que regresan a tu sitio experimentan tiempos de carga drásticamente menores porque la mayoría de recursos ya están en su dispositivo.

## Percentil 75 vs percentil 95: la diferencia en conversiones

La diferencia entre optimizar para p75 y optimizar para p95 se mide en dinero.

Un estudio de datos de ecommerce muestra que los usuarios en el percentil 95 de tiempo de carga tienen una tasa de conversión entre un 30% y un 50% menor que los usuarios en el percentil 50. Esa diferencia no se ve en las métricas de Google, pero se ve en el balance.

Optimizar para el p95 no requiere una reestructuración completa del sitio. Requiere entender que el usuario que más sufre es el que menos margen tiene para esperar, y que cada milisecondo que le ahorras es una oportunidad de conversión que recuperas.

Las empresas que miden y optimizan para percentiles superiores reportan mejoras en tasa de conversión del 5% al 15% en móvil, segmento donde la brecha entre p75 y p95 es más pronunciada.

## Conclusión

El percentil 75 de Core Web Vitals es un estándar técnico que Google usa para evaluar millones de sitios. No es un estándar de negocio. Si tu estrategia de optimización se limita a pasar el test de Google, estás ignorando al 25% de tus usuarios que están teniendo la peor experiencia y que probablemente representan una fracción significativa de tus ingresos perdidos.

No se trata de obsesionarse con el percentil 99. Se trata de medir más allá del p75, identificar dónde están las brechas y atacar los puntos específicos que más dañan a los usuarios lentos: JavaScript excesivo, fuentes web bloqueantes, layout shift y recursos sin preload.

El percentil 75 te dice que tu web es aceptable. El percentil 95 te dice cuántos clientes estás perdiendo. Mide ambos. Optimiza para ambos. Tu balance te lo agradecerá.

## Preguntas frecuentes

### ¿Por qué Google usa el percentil 75 y no el promedio?

El promedio (percentil 50) se distorsiona fácilmente con valores extremos. Un sitio con muchos usuarios rápidos y unos pocos extremadamente lentos puede tener un promedio aceptable mientras una fracción significativa sufre. El percentil 75 filtra el 25% superior de valores extremos sin perder de vista la experiencia de la mayoría. Es un compromiso estadístico, no un estándar de calidad de negocio.

### ¿Cómo sé si el 25% restante de mis usuarios está teniendo problemas?

Consulta los percentiles p90 y p95 de tus métricas. Puedes hacerlo con la API de CrUX, con herramientas de RUM como SpeedCurve o New Relic, o con el CrUX Dashboard en Looker Studio. Si la diferencia entre p75 y p90 es más del 50%, tienes un segmento significativo con experiencia mala.

### ¿Mis Core Web Vitals están en verde pero los usuarios se quejan, qué hago?

Es el síntoma clásico del sesgo del p75. Mide percentiles superiores (p90, p95), segmenta por dispositivo y conexión, e identifica qué páginas y qué dispositivos concentran las quejas. La solución casi siempre está en reducir JavaScript, optimizar fuentes y eliminar layout shift.

### ¿Optimizar para el p95 afecta negativamente a los demás usuarios?

No. Las optimizaciones que benefician al p95 (menos JavaScript, font-display: swap, preload de recursos, service workers) benefician a todos los usuarios. No hay trade-off. Mejorar la experiencia del segmento más lento mejora la experiencia general.

### ¿Qué herramientas puedo usar para medir más allá del p75?

Real User Monitoring (RUM) como SpeedCurve, New Relic Browser o Datadog RUM te dan percentiles personalizados y segmentación completa. Sin presupuesto, la API de CrUX te da p50, p75, p90 y p95 gratuitamente. Google Analytics 4 con el Web Vitals Report también permite análisis por segmentos.

### ¿El percentil 95 es un estándar de la industria?

No existe un estándar oficial para el p95 en rendimiento web. Google usa p75 como referencia. Pero los equipos de producto y CRO que optimizan para conversiones tienden a mirar p90 y p95 porque esos percentiles capturan a los usuarios que más impactan en la tasa de conversión y en los ingresos.
