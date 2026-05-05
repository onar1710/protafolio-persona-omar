---
title: 'Cache Hit Ratio: Cómo Mejorar CWV en Hosting Compartido'
description: 'La cache hit ratio conecta métricas de servidor con Core Web Vitals. Aprende a mejorar LCP e INP en hosting compartido de WordPress sin cambiar de plan ni gastar más dinero.'
keywords: 'cache hit ratio mejorar velocidad, cache servidor core web vitals, hosting compartido lento solucion, mejorar LCP sin cambiar hosting, cache wordpress impacto rendimiento, velocidad web barata hosting compartido'
relatedGroup: 'etiqueta-1'
pubDate: '2026-05-01T12:00:00-05:00'
heroImageUrl: '/assets/blog/cache-hit-ratio-cwv-servidores-compartidos-hero.jpg'
---

Tienes un cliente con WordPress en hosting compartido. Pagas entre 3 y 8 dólares al mes. El sitio funciona, carga las páginas, los usuarios navegan sin problemas aparentes. Pero cuando ejecutas PageSpeed Insights, el LCP está en 3.8 segundos y el INP roza los 300ms. Tu cliente te pregunta por qué la web es lenta y tú sabes que la respuesta obvia es "cambiar a un servidor mejor". Pero el cliente no quiere pagar más, y tú no quieres perderlo.

La mayoría de freelancers y agencias pequeñas enfrentan este dilema constantemente. El hosting compartido tiene limitaciones reales: recursos de CPU compartidos, memoria RAM limitada, I/O de disco lento. Pero dentro de esas limitaciones hay una variable que casi nadie mide y que tiene un impacto directo sobre las Core Web Vitals: la cache hit ratio del servidor. Cuando un servidor con hosting compartido atiende una petición, puede entregar la página desde caché (un "hit") o tiene que generarla desde cero ejecutando PHP y consultando la base de datos (un "miss"). La diferencia entre ambas puede ser de 200ms a 2000ms.

Nadie en español conecta estos dos mundos: las métricas técnicas del servidor con las métricas de experiencia de usuario que mide Google. Si buscas una forma de mejorar LCP sin cambiar hosting y lograr velocidad web barata en hosting compartido, la cache hit ratio es tu respuesta. Vamos a hacerlo.

## Qué es la cache hit ratio y por qué te importa

La cache hit ratio es el porcentaje de peticiones que el servidor atiende desde su caché en vez de generar la respuesta desde cero. Si tu servidor recibe 100 peticiones y 80 las entrega desde caché, tu cache hit ratio es del 80%. Las otras 20 son "misses": el servidor tuvo que ejecutar PHP, consultar MySQL, generar el HTML y entregarlo. Ese proceso toma entre 500ms y 3000ms dependiendo de la complejidad de la página.

Un "hit" de caché, en cambio, entrega el HTML pre-generado en 10 a 50ms. No hay ejecución de PHP. No hay consulta a la base de datos. El servidor simplemente lee un archivo de la memoria o del disco y lo envía al navegador.

La conexión con Core Web Vitals es directa. El LCP depende de qué tan rápido el servidor entrega el HTML inicial. Si el servidor tarda 2 segundos en generar la respuesta (cache miss), el navegador ni siquiera empieza a pintar la página hasta que ese HTML llega. Esos 2 segundos se suman al LCP. En cambio, si el servidor entrega el HTML en 50ms desde caché (cache hit), el navegador empieza a pintar inmediatamente. El LCP se reduce en segundos sin tocar una sola línea de código del front-end.

Para el INP, la relación es más indirecta pero igual de relevante. El cache servidor core web vitals están conectados: cuando el servidor procesa peticiones que podrían estar en caché, consume CPU y memoria que comparte con otros sitios del mismo servidor. Esa carga compartida hace que todas las peticiones, incluyendo las de AJAX que tu sitio hace para funcionalidades interactivas, sean más lentas. Un servidor con buena cache hit ratio está menos cargado y responde más rápido a las interacciones del usuario.

## Cómo medir tu cache hit ratio

No puedes mejorar lo que no mides. La mayoría de freelancers nunca revisan esta métrica porque no saben que existe o no saben dónde encontrarla.

### En servidores con LiteSpeed

Si tu hosting usa LiteSpeed (muy común en hosting compartido económico), la cache hit ratio aparece en el panel de LiteSpeed Cache dentro de WordPress. Ve a LiteSpeed Cache > Dashboard > Cache Statistics. Ahí ves el número de hits, misses y el ratio porcentual.

Un ratio saludable está por encima del 70%. Si tu ratio está por debajo del 50%, la mitad de las visitas a tu sitio están forzando al servidor a generar páginas desde cero. Eso es un problema directo de rendimiento.

### En servidores con cPanel y caché de servidor

Algunos hosting compartidos ofrecen caché a nivel de servidor (Varnish, nginx cache, Memcached). Pregunta a tu proveedor si tienen caché de servidor activado. Si usan Varnish, puedes ver el estado de la caché revisando los headers HTTP de tu sitio. Busca el header `X-Varnish`: si aparece con dos números (por ejemplo `X-Varnish: 123456 789012`), fue un hit. Si aparece con un solo número, fue un miss.

Para ver los headers, abre Chrome DevTools > Network > selecciona la petición del documento > pestaña Headers.

### En WordPress con plugins de caché

WP Rocket, W3 Total Cache, WP Super Cache. Todos generan archivos HTML estáticos que el servidor entrega en vez de ejecutar PHP. Pero la efectividad depende de cuántas páginas están realmente en caché y cuántas se regeneran constantemente.

Para medirlo, instala el plugin **Query Monitor** y revisa cuántas consultas a la base de datos se ejecutan por página. Si una página tiene más de 50 queries y tu caché no está funcionando, cada visita está ejecutando esas consultas. Con caché funcionando, el número de queries debería ser 0 para páginas cacheadas.

## Por qué tu cache hit ratio es bajo (y qué hacer al respecto)

Un ratio bajo tiene causas específicas y cada una tiene solución. Si tu hosting compartido es lento, estas son las soluciones reales que funcionan:

### Páginas que no se cachean

Muchos plugins de caché excluyen páginas por defecto: páginas de login, páginas de usuario logueado, páginas de WooCommerce como carrito y checkout. Eso es correcto para esas páginas. Pero a veces las exclusiones se extienden más de lo necesario.

Revisa la configuración de exclusión de tu plugin de caché. Si tienes páginas de categoría, etiquetas o páginas de autor excluidas sin razón, estás perdiendo hits de caché para contenido que no cambia frecuentemente. Cada exclusión innecesaria es un cache miss que tu servidor podría haber atendido en 50ms en vez de 1500ms.

### Caché que se purga demasiado frecuentemente

WordPress tiene un hook llamado `clean_post_cache` que se ejecuta cada vez que guardas un post, editas un comentario o actualizas un plugin. Muchas configuraciones de caché responden a este evento purgando toda la caché del sitio. Si tienes auto-guardados frecuentes o plugins que actualizan contenido constantemente, tu caché se está vaciando cada pocos minutos.

La solución es configurar purgas selectivas. Cuando actualices un post, solo la página de ese post y la página principal necesitan regenerarse. No las 200 páginas de categoría, etiqueta y archivo del sitio. WP Rocket y LiteSpeed Cache permiten configurar purgas parciales. W3 Total Cache también, aunque su interfaz es más compleja.

### Cookies de sesión que evitan la caché

WooCommerce, plugins de membresía y plugins de traducción (como WPML o Polylang) generan cookies que indican al servidor que el usuario tiene una sesión activa. Si el servidor detecta esa cookie, entrega la versión dinámica en vez de la versión cacheada. Esto es correcto para páginas que necesitan ser dinámicas, pero incorrecto para páginas estáticas que el usuario visitó antes de iniciar sesión.

El problema se amplifica cuando los plugins dejan cookies residuales que persisten incluso después de cerrar sesión. Revisa qué cookies tiene tu sitio (DevTools > Application > Cookies). Si ves cookies de WooCommerce en páginas que no son de WooCommerce, el servidor está evitando la caché innecesariamente.

### Tráfico de bots que vacía la caché

Los bots de Google, Bing y otros crawlers visitan tu sitio constantemente. Cada visita de un bot a una página que no está en caché genera un miss. Si tu sitio tiene muchas páginas y Google las rastrea frecuentemente, una parte significativa de tus misses viene de bots, no de usuarios reales.

La solución es configurar la caché para que también sirva a bots. LiteSpeed Cache tiene una opción específica para esto. WP Rocket también permite cachear para bots de búsqueda. No es una práctica universal (algunos SEOs prefieren que los bots siempre vean contenido fresco), pero para sitios que no cambian de contenido a diario, es una mejora significativa en cache hit ratio.

## El impacto real de la cache hit ratio en LCP e INP

Hablemos con números. En un hosting compartido típico:

**Cache miss:** el servidor ejecuta PHP + MySQL, genera el HTML. Tiempo de respuesta del servidor: 800ms a 2500ms.

**Cache hit:** el servidor entrega el HTML desde disco o memoria. Tiempo de respuesta: 20ms a 80ms.

La diferencia es el TTFB (Time to First Byte). Google recomienda un TTFB inferior a 800ms. Con cache misses frecuentes, tu TTFB puede estar en 1500ms o más. Ese tiempo se suma directamente al LCP, porque el navegador no puede empezar a renderizar hasta que recibe el primer byte del HTML.

Si tu cache hit ratio pasa de 40% a 85%, el TTFB promedio baja de 1200ms a 200ms. Eso son 1000ms de mejora en LCP sin tocar una sola imagen, sin minificar CSS, sin activar CDN. Solo con que el servidor entregue páginas desde caché.

Para el INP, el impacto es más visible en momentos de carga alta del servidor. Cuando el servidor está procesando cache misses para varios usuarios simultáneamente, la CPU está ocupada. Si un usuario hace clic en un botón y el sitio necesita hacer una petición AJAX, esa petición compite por CPU con los misses de otros usuarios. Con una buena cache hit ratio, la CPU está más disponible y las respuestas AJAX son más rápidas.

## Cómo mejorar la cache hit ratio en WordPress: el impacto real en rendimiento

### Paso 1: Activa la caché de servidor

Si tu hosting usa LiteSpeed, asegúrate de que LiteSpeed Cache esté activado a nivel de servidor, no solo como plugin. Muchos hosting tienen LiteSpeed instalado pero no activan la caché por defecto. Pregunta a tu proveedor.

Si tu hosting usa Apache o nginx, necesitas un plugin de caché que genere archivos HTML estáticos. WP Rocket es la opción más sencilla. LiteSpeed Cache es la mejor opción si tu servidor es LiteSpeed.

### Paso 2: Configura la caché de página correctamente

En WP Rocket: Settings > Cache > Activa "Enable for mobile devices" y "Enable for logged-in WordPress users" solo si tu sitio no tiene funcionalidad de usuario logueado (foros, membership). Si sí la tiene, desactiva la caché para usuarios logueados pero asegúrate de que el resto de páginas estén cacheadas.

En LiteSpeed Cache: Cache > Cache Settings > Activa "Enable Cache" y "Cache Logged-in Users" solo si aplica. Revisa la pestaña "Exclude" y elimina exclusiones innecesarias.

### Paso 3: Configura la precarga de caché

La precarga visita automáticamente las páginas de tu sitio para generar la caché antes de que un usuario real las visite. Sin precarga, el primer usuario que visita una página recibe un cache miss. Con precarga, todos los usuarios reciben un cache hit.

En WP Rocket: Settings > Preload > Activa "Activate Preloading" y "Activate Sitemap-based Cache Preloading". Asegúrate de que la URL de tu sitemap esté configurada.

En LiteSpeed Cache: Cache > Cache Settings > Activa "Enable Cache Cron" y "Enable Cache HTTP Cron".

### Paso 4: Reduce las purgas innecesarias

Revisa qué eventos purgan tu caché. En WP Rocket, ve a Settings > Advanced Rules y configura la purga automática para que solo se active cuando editas contenido, no cuando un plugin actualiza datos internos.

En LiteSpeed Cache: Cache > Purge y configura purgas selectivas. Desactiva "Purge All on Upgrade" si actualizas plugins frecuentemente y no quieres que la caché se vacíe por completo cada vez.

### Paso 5: Excluye páginas que realmente necesitan ser dinámicas

Solo excluye de la caché las páginas que realmente cambian con cada usuario:

- Carrito y checkout de WooCommerce
- Páginas de cuenta de usuario
- Formularios con tokens CSRF dinámicos

Todo lo demás puede (y debe) estar cacheado.

## La combinación ganadora: caché + CDN

Una vez que tu cache hit ratio está por encima del 70%, el siguiente paso es poner un CDN como Cloudflare (plan gratuito). El CDN almacena copias de tus páginas cacheadas en servidores distribuidos globalmente. Cuando un usuario de otro país visita tu sitio, el CDN entrega la página desde el servidor más cercano, no desde tu hosting compartido.

La combinación de buena cache hit ratio + CDN reduce el TTFB de forma dramática:

- Sin caché ni CDN: TTFB de 1500ms (cache miss + servidor lejano)
- Con caché pero sin CDN: TTFB de 200ms (cache hit + servidor cercano)
- Con caché y CDN: TTFB de 50ms (cache hit + CDN edge)

Esa combinación puede bajar el LCP de 4 segundos a menos de 2 segundos en hosting compartido, sin cambiar de plan.

## Cuándo la caché no es suficiente

Hay escenarios donde por más que optimices la caché, el hosting compartido no da para más:

- Sitios con miles de páginas que Google rastrea constantemente, generando misses frecuentes
- Tiendas WooCommerce con miles de productos donde cada categoría tiene miles de combinaciones de filtros
- Sitios con mucho tráfico concurrente (más de 50 usuarios simultáneos) donde la CPU compartida se satura

En esos casos, la caché mejora la situación pero no la resuelve completamente. El paso siguiente es un VPS económico (entre 6 y 12 dólares al mes) donde tienes CPU y RAM dedicados. Pero para la mayoría de sitios pequeños y medianos en hosting compartido, una buena configuración de caché es suficiente para mantener métricas de Core Web Vitals aceptables.

## Conclusión

La cache hit ratio es la métrica que nadie mide pero que tiene el mayor impacto en el rendimiento de sitios WordPress en hosting compartido. Cada cache miss cuesta entre 500ms y 2500ms de TTFB que se suman directamente al LCP. Cada cache hit entrega el HTML en menos de 80ms.

Para freelancers y agencias pequeñas con clientes en hosting compartido, la estrategia no es convencer al cliente de pagar más por un mejor servidor. Es configurar correctamente la caché que ya tiene disponible. Un hosting compartido con una cache hit ratio del 85% puede superar en rendimiento a un VPS con una cache hit ratio del 30%.

Mide tu ratio. Configura la precarga. Reduce las purgas innecesarias. Excluye solo lo imprescindible. Y si después de todo eso el ratio sigue bajo, el problema no es la configuración de caché, es el volumen de tráfico que tu hosting no puede manejar. Ahí sí toca cambiar de plan, pero no antes.

## Preguntas frecuentes

### ¿Qué cache hit ratio debería tener mi sitio WordPress?

Por encima del 70% es aceptable. Por encima del 85% es ideal. Si tu ratio está por debajo del 50%, la mitad de las visitas están forzando al servidor a generar páginas desde cero, y tu LCP está sufriendo por ello.

### ¿La caché del servidor afecta los datos de Google Analytics?

No. Google Analytics se ejecuta en el navegador del usuario con JavaScript, independientemente de si la página se sirvió desde caché o no. Los datos de Analytics siguen siendo correctos. Lo que cambia es el tiempo de respuesta del servidor, no el contenido de la página.

### ¿Puedo mejorar LCP sin cambiar de hosting?

Sí. La cache hit ratio tiene un impacto directo en el TTFB, que a su vez impacta el LCP. Configurar correctamente la caché de servidor puede reducir el LCP entre 500ms y 2000ms sin cambiar de plan. Esto es especialmente relevante para sitios WordPress en hosting compartido donde la diferencia entre un cache hit y un cache miss es de segundos.

### ¿WP Rocket o LiteSpeed Cache para hosting compartido?

Si tu hosting usa servidores LiteSpeed, usa LiteSpeed Cache. La integración con el servidor es nativa y la cache hit ratio será mejor. Si tu hosting usa Apache o nginx, WP Rocket es la opción más compatible y fácil de configurar. No instales ambos.

### ¿El CDN reemplaza la caché del servidor?

No. Son complementarios. La caché del servidor genera y almacena las páginas en tu hosting. El CDN distribuye copias de esas páginas a nivel global. Si la caché del servidor no funciona, el CDN no tiene nada que distribuir y tiene que pedir la página al servidor de origen en cada petición.

### ¿Cada cuánto se debería regenerar la caché?

Depende de la frecuencia de actualización de tu contenido. Si publicas un post nuevo diariamente, la caché puede regenerarse diariamente. Si actualizas contenido varias veces al día, configura purgas selectivas por URL en vez de purgas totales. El objetivo es que la mayor cantidad posible de páginas estén en caché durante el mayor tiempo posible.
