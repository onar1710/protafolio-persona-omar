---
title: 'Cómo Afecta el Sesgo de CrUX a tus Decisiones de Negocio'
description: 'CrUX agrega datos de 28 días y el percentil 75 puede ocultar problemas graves. Aprende a interpretar correctamente los datos de rendimiento cuando CrUX no es fiable para tu sitio.'
keywords: 'sesgo CrUX, CrUX datos contradictorios, PageSpeed Insights vs CrUX, percentil 75 CrUX, sitios poco tráfico CrUX, interpretar datos rendimiento web'
relatedGroup: 'etiqueta-1'
pubDate: '2026-05-01T12:00:00-05:00'
heroImageUrl: '/assets/blog/como-afecta-sesgo-crux-decisiones-negocio-hero.jpg'
---

Tienes dos pantallas abiertas. En una, PageSpeed Insights te dice que tu web va bien: LCP en verde, CLS bajo, INP aceptable. En la otra, Google Search Console te muestra que el 40% de tus URLs están en "Necesita mejorar". Si te has preguntado por qué tus métricas web no coinciden entre herramientas, no estás solo. Ambas supuestamente usan datos reales de usuarios. Ambas no pueden tener razón al mismo tiempo, ¿o sí?

La confusión es más común de lo que crees. SEOs técnicos y desarrolladores se topan con esta contradicción constantemente. Y el problema no es que una herramienta esté rota. El problema es que CrUX —el dataset que alimenta ambas herramientas— tiene sesgos estructurales que casi nadie te explica. Si tomas decisiones de negocio basándote en CrUX sin entender sus limitaciones, estás navegando con un mapa incompleto.

Vamos a desmontar los sesgos de CrUX uno por uno, con datos concretos y ejemplos reales, para que sepas exactamente cuándo confiar en tus métricas y cuándo no.

## Qué es CrUX y por qué no es lo que parece

CrUX (Chrome User Experience Report) es la fuente de datos de campo que Google usa para medir el rendimiento real de los sitios web. Recopila métricas directamente desde Chrome en dispositivos de usuarios reales. Suena perfecto: datos reales, no simulados. Pero la realidad es más complicada.

CrUX no mide a todos tus usuarios. Mide a una muestra. Y esa muestra tiene reglas que Google no siempre explica de forma transparente. Si no entiendes esas reglas, vas a tomar decisiones equivocadas sobre optimización, priorización de recursos e incluso sobre si tu sitio necesita intervención urgente.

## El sesgo de los 28 días: la ventana que suaviza todo

CrUX agrega los datos en ventanas de 28 días. Eso significa que el valor que ves hoy en PageSpeed Insights no es de ayer ni de la semana pasada. Es el promedio ponderado de lo que ocurrió durante las últimas cuatro semanas.

¿Qué implica esto en la práctica? Que si desplegaste un cambio que empeoró tu LCP hace 10 días, CrUX todavía está mezclando esos datos malos con los 18 días anteriores donde todo funcionaba bien. Tu métrica aparece como "buena" porque el promedio diluye el problema.

Al revés también pasa. Si arreglaste un bug grave hace una semana, CrUX tardará entre 2 y 4 semanas en reflejar la mejora completa. Durante ese periodo, sigues viendo métricas rojas que ya no corresponden con la realidad actual.

Para decisiones de negocio, esto es peligroso. Imagina que tu equipo técnico optimizó el sitio y tú, al ver que CrUX sigue en rojo, concluyes que el trabajo no sirvió y recortas el presupuesto. O al revés: ves métricas verdes después de un despliegue y decides que todo está bien, cuando en realidad el problema está empezando a acumularse pero CrUX todavía no lo refleja. Muchas veces los profesionales interpretan estos valores como CrUX datos incorrectos, cuando en realidad son datos reales con un retraso temporal que no se está considerando.

**Cómo mitigarlo:** no tomes decisiones basándote solo en el valor de CrUX que ves hoy. Compara con los datos de CrUX de hace 4 semanas (los puedes consultar en el CrUX Dashboard o en la API de CrUX). Si el valor de hoy es peor que el de hace un mes, el problema es real y persistente. Si es mejor, espera a que la ventana de 28 días se actualice completamente antes de celebrar.

## Sitios con poco tráfico: cuando CrUX no existe para ti

Este es el sesgo que más daño causa a pequeñas empresas, startups y proyectos nuevos. CrUX solo tiene datos si tu sitio recibe suficiente tráfico desde Chrome. Google no publica el umbral exacto, pero la experiencia muestra que sitios con menos de unos pocos miles de visitas mensuales desde Chrome simplemente no aparecen en CrUX. Es muy común ver consultas en foros de SEO preguntando por qué Core Web Vitals no aparecen en Search Console, y la respuesta casi siempre es la misma: poco tráfico CrUX sin datos suficientes para generar el informe.

Si tu sitio no tiene datos de CrUX, PageSpeed Insights te muestra una pantalla que dice "The Chrome User Experience Report does not have sufficient real-world speed data for this page." Y ahí es donde muchos SEOs y desarrolladores se confunden: creen que el problema es técnico (que algo está roto en la herramienta) cuando el problema es estadístico (no hay suficientes datos).

Para un negocio que está empezando o que tiene un nicho con poco tráfico, esto significa que **no puedes medir tu rendimiento real con CrUX**. Tienes que conformarte con datos de laboratorio (Lighthouse, WebPageTest), que simulan condiciones ideales que no reflejan lo que experimenta tu usuario real con su móvil de gama media y su conexión 3G.

**Cómo mitigarlo:** si tu sitio no tiene datos de CrUX, usa Lighthouse como referencia pero multiplíca los valores de LCP por 1.5 a 2x para obtener una estimación más realista. Lighthouse ejecuta desde servidores con conexiones rápidas. Tu usuario real no tiene esa ventaja. También puedes usar WebPageTest con perfiles de conexión móvil para obtener datos más cercanos a la realidad.

## El percentil 75: la métrica que esconde al 25% más afectado

Aquí es donde el sesgo de CrUX se vuelve realmente problemático para decisiones de negocio. Google evalúa tus Core Web Vitals usando el percentil 75 (p75). Entender cómo funciona el CrUX percentil 75 es clave: si el 75% de tus usuarios tienen una experiencia buena, Google te marca como "aprobado". El otro 25% puede estar teniendo una experiencia terrible y CrUX no lo refleja.

¿Por qué el 25% importa? Porque no es un grupo homogéneo. Ese 25% probablemente incluye a usuarios en dispositivos más lentos, conexiones más inestables o regiones geográficas con peor infraestructura. En muchos mercados (Latinoamérica, Sudeste Asiático, África), ese porcentaje puede ser mucho mayor que el 25%.

Un ejemplo concreto: tu ecommerce tiene un LCP de 2.2 segundos en p75. Google lo marca como "Good" (el umbral es 2.5s). Pero el percentil 90 está en 5.8 segundos. Eso significa que 1 de cada 10 usuarios espera casi 6 segundos para ver el contenido principal. Esos usuarios están abandonando tu tienda. Son ventas perdidas que no ves en CrUX porque el p75 las oculta.

Para un negocio online, el percentil 75 es peligroso porque te da una falsa sensación de seguridad. Tú ves verde en Search Console, tu jefe ve verde, todo el equipo ve verde. Pero el 25% de tus visitantes está teniendo una experiencia que los hace irse.

**Cómo mitigarlo:** consulta el CrUX Dashboard o la API de CrUX para obtener los percentiles 50, 75, 90 y 95 por separado. Si hay un salto grande entre p75 y p90, tienes un problema real que CrUX no te está mostrando. También puedes segmentar por país y dispositivo en la API de CrUX para identificar dónde están los usuarios más afectados.

## CrUX y la segmentación por dispositivo: la brecha oculta

CrUX separa los datos entre mobile y desktop. Pero dentro de cada categoría, hay una variación enorme que no se ve. Un usuario con un iPhone de última generación y conexión 5G no experimenta lo mismo que alguien con un Android de gama baja y 3G. Ambos aparecen como "mobile" en CrUX.

Google no segmenta por tipo de dispositivo dentro de mobile ni por velocidad de conexión. Eso significa que tu LCP de 2.0 segundos en mobile puede estar compuesto por usuarios de gama alta con 1.2 segundos y usuarios de gama baja con 4.5 segundos. El promedio se ve bien, pero una parte significativa de tu audiencia está sufriendo.

Para negocios cuyo público objetivo usa dispositivos de gama media o baja (que es la mayoría en Latinoamérica), este sesgo subestima el problema real.

**Cómo mitigarlo:** usa la extensión Web Vitals de Chrome en tu propio dispositivo y pide a testers que usen dispositivos reales de gama baja. También puedes configurar WebPageTest con perfiles de dispositivos Android de gama media (Moto G, Samsung Galaxy A series) para obtener datos más representativos de tu audiencia real.

## PageSpeed Insights vs CrUX: por qué no coinciden

La confusión más frecuente es ver resultados diferentes en PageSpeed Insights. La diferencia entre PageSpeed Insights y CrUX no es un error de las herramientas, sino que proviene de que cada sección usa una fuente distinta. La herramienta muestra dos secciones distintas:

**"Datos de campo"** (Field Data): esto es CrUX. Datos reales de usuarios, agregados en 28 días, con el percentil 75. Si tu sitio tiene poco tráfico, esta sección puede estar vacía o mostrar datos parciales.

**"Datos de laboratorio"** (Lab Data): esto es Lighthouse. Una simulación desde un servidor con condiciones controladas. Siempre va a tener datos porque no depende del tráfico real.

Cuando ambas secciones muestran valores diferentes (y casi siempre lo hacen), no es un error. Son dos mediciones distintas de dos fuentes distintas. Los datos de campo son más relevantes porque reflejan lo que tus usuarios reales experimentan. Los datos de laboratorio son más útiles para diagnosticar problemas específicos porque controlan las variables.

El error es tratar los datos de laboratorio como si fueran reales. Si Lighthouse dice que tu LCP es 1.8 segundos pero CrUX dice 3.2 segundos, el valor real es el de CrUX. Lighthouse no captura factores como la variabilidad de la red, la carga del dispositivo del usuario o el impacto de scripts de terceros que solo se activan en condiciones reales.

**Cómo tomar decisiones correctas:** usa CrUX para saber qué tan bien o mal está tu sitio para los usuarios reales. Usa Lighthouse para entender por qué y qué puedes arreglar. Nunca uses uno solo.

## El sesgo geográfico: CrUX no representa a todos por igual

CrUX recoge datos de usuarios de Chrome en todo el mundo, pero la distribución no es uniforme. Si la mayoría de tu tráfico viene de Estados Unidos o Europa, tus datos de CrUX están dominados por usuarios con buenas conexiones y dispositivos recientes. Si tu negocio opera en mercados emergentes, CrUX puede estar infra-representando a tu audiencia más importante.

Google permite filtrar por país en la API de CrUX, pero no todas las herramientas exponen esa funcionalidad. PageSpeed Insights no te muestra datos segmentados por país. Para obtener esa información, necesitas consultar la API directamente o usar herramientas como CrUX Dashboard en Looker Studio.

**Cómo mitigarlo:** si tu negocio tiene audiencia en mercados con infraestructura limitada, consulta los datos de CrUX segmentados por país. Compara el p75 de tu país principal con el global. Si hay una diferencia significativa, los datos globales no son representativos de tu audiencia y no deberías tomar decisiones basándote en ellos.

## Cuándo NO debes confiar en CrUX

Hay escenarios específicos donde CrUX simplemente no es fiable para tomar decisiones:

**Sitios nuevos o con poco tráfico:** no hay datos suficientes. Usa Lighthouse y WebPageTest con perfiles que representen a tus usuarios reales.

**Después de un cambio reciente:** CrUX tiene un retraso de hasta 4 semanas. Para evaluación inmediata post-despliegue, usa datos de RUM (Real User Monitoring) como los que ofrecen herramientas como SpeedCurve, New Relic o Datadog.

**Cuando el p75 se ve bien pero las quejas de usuarios son frecuentes:** el percentil 75 está ocultando el problema. Consulta percentiles superiores (p90, p95) y segmenta por dispositivo y conexión.

**Cuando PageSpeed Insights muestra datos de laboratorio buenos pero Search Console muestra URLs en rojo:** los datos de campo son los reales. La simulación de Lighthouse no refleja las condiciones de tus usuarios.

## Qué usar en lugar de (o además de) CrUX

Si CrUX no te da la imagen completa, estas alternativas te dan datos más granulares:

**Real User Monitoring (RUM):** herramientas como SpeedCurve, New Relic Browser o Datadog RUM recopilan métricas directamente de todos tus usuarios, no solo de Chrome. Te dan percentiles personalizados, segmentación por dispositivo, conexión y geografía, y datos en tiempo real.

**WebPageTest:** gratuito, permite configurar dispositivos específicos, velocidades de conexión y ubicaciones geográficas. Ideal para comparar tu sitio con el de la competencia en condiciones controladas.

**Lighthouse CI:** integra Lighthouse en tu pipeline de desarrollo para detectar regresiones de rendimiento antes de que lleguen a producción. No reemplaza a CrUX pero evita que problemas nuevos lleguen al p75.

La mejor estrategia es combinar fuentes. Usa CrUX como termómetro general, Lighthouse para diagnóstico técnico, y RUM para decisiones de negocio basadas en datos completos de todos tus usuarios.

## Conclusión

CrUX es una herramienta valiosa, pero tiene sesgos estructurales que afectan directamente las decisiones de negocio. La ventana de 28 días suaviza problemas reales y retrasa la visibilidad de mejoras. El percentil 75 oculta a usuarios que están teniendo una experiencia terrible. Los sitios con poco tráfico no aparecen en el dataset. Y la segmentación geográfica y por dispositivo es insuficiente para negocios con audiencias específicas.

No se trata de dejar de usar CrUX. Se trata de entender qué te está diciendo y qué no. Si tomas decisiones de optimización, inversión o priorización basándote solo en los valores de p75 que ves en PageSpeed Insights, estás trabajando con información incompleta. Los datos reales están en los percentiles que no se muestran por defecto, en los países que no se filtran automáticamente, y en los dispositivos que CrUX agrupa sin distinguir.

Interpreta CrUX con contexto. Compara con otras fuentes. Y nunca asumas que verde significa que todo está bien.

## Preguntas frecuentes

### ¿Por qué PageSpeed Insights y Search Console muestran datos diferentes?

Porque aunque ambas herramientas usan CrUX, lo presentan de forma distinta. PageSpeed Insights muestra datos a nivel de URL individual (si hay suficiente tráfico). Search Console agrupa datos por grupos de URLs similares. Además, Search Console usa un periodo de evaluación diferente y puede incluir URLs que PageSpeed Insights no tiene datos para. Ambos son CrUX, pero la ventana de agregación y la granularidad cambian los resultados.

### ¿Puedo confiar en CrUX si mi sitio tiene menos de 1,000 visitas mensuales?

Probablemente no. CrUX necesita un volumen mínimo de datos de Chrome para generar un informe. Si tu sitio no aparece en CrUX o solo muestra datos parciales, usa Lighthouse como referencia multiplicando los valores por 1.5 a 2x. Para datos más precisos, implementa una solución de RUM que mida directamente a tus usuarios.

### ¿Qué percentil debería mirar para decisiones de negocio?

El percentil 75 es el que Google usa para evaluar, pero para decisiones de negocio mira también el p90. Si la diferencia entre p75 y p90 es grande (más del 50%), tienes una fracción significativa de usuarios con mala experiencia que el p75 oculta. Para ecommerce, el p90 es más relevante porque cada usuario que abandona es una venta perdida.

### ¿Cuánto tarda CrUX en reflejar cambios reales?

Entre 2 y 4 semanas. CrUX usa una ventana móvil de 28 días. Los datos más recientes se mezclan con los de semanas anteriores, así que un cambio positivo o negativo se va diluyendo gradualmente. Para evaluación inmediata post-despliegue, usa datos de RUM o ejecuta Lighthouse/WebPageTest manualmente.

### ¿CrUX mide a todos los navegadores?

No. Solo mide a usuarios de Chrome en dispositivos con el historial de navegación activado y la sincronización de datos habilitada. Usuarios de Firefox, Safari, Edge (en modo no-Chromium) y Chrome con configuraciones de privacidad estrictas no están incluidos. Esto introduce un sesgo adicional que pocos consideran.

### ¿Es mejor usar RUM en lugar de CrUX?

Para decisiones de negocio, sí. RUM mide a todos tus usuarios reales, sin importar el navegador, y te permite personalizar percentiles, segmentar por cualquier dimensión y obtener datos en tiempo real. CrUX es útil como referencia gratuita y estándar de la industria, pero no debería ser tu única fuente de verdad para decisiones que afectan ingresos.
