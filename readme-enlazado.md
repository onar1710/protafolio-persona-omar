# Enlazado interno automático (por similitud al título)

Este proyecto genera entre 5 y 10 enlaces internos automáticos dentro del contenido de cada post (dependiendo del largo del artículo), eligiendo el destino por similitud entre el **título del artículo destino** y el **texto del artículo actual**.

El enlace se inserta dentro de un párrafo (no en títulos), sin cortar el primer párrafo ni empezar un párrafo con enlace.

## Dónde está implementado

- Lógica principal: [BlogPost.astro](file:///c:/Users/123/protafolio-persona-omar/src/layouts/BlogPost.astro)
- Los posts se pasan desde:
  - [blog/[...slug].astro](file:///c:/Users/123/protafolio-persona-omar/src/pages/blog/%5B...slug%5D.astro)
  - [disenoweb/[...slug].astro](file:///c:/Users/123/protafolio-persona-omar/src/pages/disenoweb/%5B...slug%5D.astro)

## Reglas que cumple

- No enlaza títulos/encabezados: solo inserta dentro de `<p>`.
- No enlaza en el primer párrafo.
- No permite que el enlace sea lo primero del párrafo (usa un offset mínimo).
- No enlaza dentro de `<a>`, `<code>` o `<pre>`.
- No repite la misma URL si ya existe un enlace hacia ese destino en el HTML del post.
- Ignora palabras genéricas para decidir relevancia (ej.: “seo”, “google”, “contenido”, “web”, “estrategia”, etc.).

## Cómo funciona (paso a paso)

### 1) Preparación del contenido del post actual

1. Se renderiza el contenido del post con `Astro.slots.render('default')` para obtener HTML.
2. Se “limpia” el HTML a texto (strip de tags) para construir un set de tokens del contenido:
   - normaliza a minúsculas y sin acentos
   - tokeniza por palabras
   - elimina stopwords
   - elimina tokens genéricos
   - descarta tokens muy cortos

Resultado: `contentTokens` (tokens de tema del artículo actual).

### 2) Selección del artículo destino (por título)

Para cada post candidato (excluyendo el actual):

1. Se construye `titleTokens` desde el `title` del candidato, con la misma normalización que el contenido.
2. Se expande `titleTokens` con equivalencias simples para mejorar match semántico (ej.: “lugares” ≈ “resultados”).
3. Se calcula el solapamiento `inter = intersectSize(titleTokens, contentTokens)`.
4. Solo se considera candidato si `inter >= 2`.
5. Se asigna un `score` basado en `inter` y tamaño del título.

Se ordenan candidatos por `score` (desc) y se intenta insertar enlaces empezando por el mejor, hasta completar el máximo calculado.

### 3) Inserción del enlace (ancla dentro del texto)

Para un candidato dado:

1. Se recorre el HTML por párrafos `<p>`.
2. Se omite el primer párrafo.
3. En cada párrafo válido, se generan ventanas (n‑gramas) de 3 a 8 palabras.
4. Una ventana es elegible si:
   - comparte al menos 2 tokens con `titleTokens`
   - no empieza/termina con stopwords
   - contiene al menos 1 palabra “fuerte” (no genérica / longitud / número)
   - no está al inicio del párrafo (offset mínimo)
5. Se elige la ventana con mejor score y se envuelve con:

```html
<a href="/ruta-del-destino/" data-interlink="auto" class="font-semibold text-primary-blue hover:underline">texto ancla</a>
```

Si un candidato no tiene una ventana válida, se prueba el siguiente, hasta completar el máximo de enlaces o agotar candidatos.

## Por qué este enfoque funciona

- El título del destino suele describir mejor el “tema real” que `keywords` del frontmatter.
- La ancla siempre sale del texto existente del artículo actual (no se inventa ni se fuerza un título).
- Las reglas evitan los enlaces artificiales (primer párrafo, inicio de párrafo, anclas genéricas, etc.).

## Cómo verificar rápido

1. Ejecuta `npm run build`.
2. Busca en `dist/` la marca `data-interlink="auto"`.

Ejemplo:
- `dist/blog/contenido-evergreen-vs-temporal-seo-posicionar/index.html`

## Ajustes comunes

- Cambiar máximo de enlaces: el sistema calcula un valor entre 5 y 10 basado en la cantidad de palabras del post.
- Afinar “genéricos”: ajustar `genericTokensHard/genericTokensSoft` si ves que está eligiendo destinos demasiado amplios.
- Afinar anclas: modificar tamaño de ventana (3–8) u offset mínimo para controlar qué tan “natural” se ve el ancla.
