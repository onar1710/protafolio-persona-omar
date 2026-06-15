---
title: "Qué fórmula clamp usar en tipografía fluida en diseño web móvil según Mobile Always"
description: "Usa fórmulas clamp en WordPress para crear tipografía fluida entre móvil y escritorio sin saltos bruscos y con tamaños expresados en rem."
keywords: "clamp tipografía fluida, font size clamp WordPress, escala modular móvil, diseño web móvil rem, tipografía responsive sin media queries, Mobile Always clamp"
pubDate: 2026-06-16T06:00:00-05:00
heroImage: '/assets/blog/formula-clamp-tipografia-fluida.jpg'
tags: ["Mobile Always"]
draft: true
---

La tipografía es uno de los pilares del diseño web. Un texto mal escalado arruina la legibilidad, daña la experiencia de usuario y puede aumentar la tasa de rebote. Durante años, los desarrolladores han utilizado media queries para declarar un tamaño de fuente para móvil y otro distinto para escritorio, generando un salto brusco en el punto de corte. Hoy existe una alternativa más elegante y continua: la función CSS `clamp()`. Este artículo explica qué fórmula de `clamp` usar para crear tipografía fluida en diseño web móvil, tomando como referencia la propuesta de Mobile Always: interpolar entre una escala modular de ratio 1.125 en móvil y una escala de ratio 1.25 en escritorio, siempre utilizando unidades `rem`.

## ¿Por qué `clamp()` reemplaza a las media queries tipográficas?

La función `clamp()` permite que un valor CSS fluya de forma continua dentro de un rango definido por un mínimo, un valor preferido (que depende del viewport) y un máximo. En tipografía, esto significa que el `font-size` puede crecer o decrecer suavemente con el ancho de la ventana, sin necesidad de puntos de quiebre.

La sintaxis básica es:

```css
font-size: clamp(valorMínimo, valorPreferido, valorMáximo);
```

El valor preferido suele ser una expresión que combina una unidad fija (`rem`) y una unidad relativa al viewport (`vw`). Por ejemplo, el fragmento que cita Mobile Always:

```css
font-size: clamp(1rem, 0.5rem + 1.5vw, 1.25rem);
```

Este código establece que:
- El tamaño mínimo será `1rem` (equivale al tamaño base del navegador, normalmente 16px).
- El tamaño máximo será `1.25rem`.
- Entre ambos extremos, el tamaño se calculará como `0.5rem + 1.5vw`.

¿Cómo funciona la parte fluida? Cuando el viewport es muy pequeño (por ejemplo, 320px de ancho), `0.5rem + 1.5vw` da un valor cercano a `0.5rem + 1.5*3.2px = 0.5rem + 4.8px`. Como `1rem` son 16px, `0.5rem` son 8px, entonces `8px + 4.8px = 12.8px`. Como `1rem` son 16px, `1rem` es mayor, así que el mínimo `1rem` prevalece. Cuando el viewport alcanza unos 1200px, `1.5vw` son 18px, `0.5rem` son 8px, total 26px, que es mayor que `1.25rem` (20px), por lo que el máximo `1.25rem` limita el valor.

El resultado: entre 320px y 1200px la fuente varía de forma continua, sin saltos. Esa es la esencia de la tipografía fluida.

## La propuesta de Mobile Always: dos escalas modulares

La mayoría de los sistemas de diseño utilizan una escala modular tipográfica: una secuencia de tamaños que siguen una relación multiplicativa (ratio). Por ejemplo, con ratio 1.25, si el tamaño base es `1rem`, el siguiente nivel sería `1.25rem`, luego `1.5625rem`, etc.

Mobile Always sugiere **no usar la misma escala para móvil y escritorio**. En pantallas pequeñas, una escala agresiva (como 1.25) produce encabezados desproporcionados que ocupan demasiado espacio vertical y rompen el flujo de lectura. Por eso recomiendan:

- Escala móvil: ratio **1.125** (más moderada, crece un 12.5% cada nivel).
- Escala escritorio: ratio **1.25** (más amplia, típica en grandes pantallas).

### ¿Cómo se traduce esto a `clamp()`?

La clave es interpolar entre un tamaño de la escala móvil (como mínimo) y el correspondiente tamaño de la escala de escritorio (como máximo). La parte fluida (`vw`) se calcula para que el crecimiento sea lineal entre 320px y 1200px (o los breakpoints que uses).

Supongamos que el tamaño base del texto (párrafo) es `1rem` en ambas escalas. Para un encabezado H1, en la escala móvil (ratio 1.125) el tamaño sería `1rem * 1.125^4` (depende de cuántos niveles subas; normalmente H1 es el nivel más alto). Pero en la práctica, se suele definir una jerarquía: h1, h2, h3, etc. Mobile Always propone una fórmula genérica:

Para cada nivel de encabezado, el mínimo (`min`) es el valor de la escala móvil (en `rem`), el máximo (`max`) es el valor de la escala escritorio (en `rem`), y la expresión fluida combina ambos con un coeficiente de viewport.

### Construcción paso a paso

1. **Define los tamaños en rem para cada escala**. Por ejemplo:

   - Móvil (ratio 1.125): base 1rem, h6 1.125rem, h5 1.2656rem, h4 1.4238rem, h3 1.6018rem, h2 1.8020rem, h1 2.0273rem.
   - Escritorio (ratio 1.25): base 1rem, h6 1.25rem, h5 1.5625rem, h4 1.9531rem, h3 2.4414rem, h2 3.0518rem, h1 3.8147rem.

   Puedes redondear a tres decimales.

2. **Elige un rango de viewport**. El más común es de 320px a 1200px, pero puede variar según tu diseño.

3. **Aplica la fórmula universal de `clamp`**:

   ```
   clamp(min, min + (max - min) * ((100vw - viewportMin) / (viewportMax - viewportMin)), max)
   ```

   Pero es más práctico usar una expresión simplificada. El siguiente método está muy difundido:

   ```
   font-size: clamp( min-rem ,  calc( min-rem + (max-rem - min-rem) * ( (100vw - 320px) / (1200 - 320) ) ), max-rem );
   ```

   Mobile Always sugiere una forma más compacta: `clamp( min-rem ,  factorFijo + factorFluido * 1vw , max-rem )`.

   Para convertir la diferencia `(max - min)` a un coeficiente de `vw`, se usa:

   ```
   pendiente = (max - min) / (viewportMax - viewportMin) * 100
   intersección = min - pendiente * (viewportMin / 100)
   ```

   Donde `pendiente` se expresa en `vw` y `intersección` en `rem`. El resultado es:

   ```
   font-size: clamp( min,  intersección + pendiente * 1vw , max );
   ```

### Ejemplo para h1 con escalas propuestas

- Móvil: `h1 = 2.0273rem`
- Escritorio: `h1 = 3.8147rem`
- Viewport mínimo: 320px, viewport máximo: 1200px

Cálculo:
- Diferencia: 3.8147rem - 2.0273rem = 1.7874rem
- Ancho de viewport en rem: 1200px - 320px = 880px. Convertido a rem (asumiendo 16px base): 880 / 16 = 55rem.
- Pendiente = 1.7874rem / 55rem * 100 = 3.25 (aproximadamente)
- Intersección = 2.0273rem - 3.25 * (320 / 100) = 2.0273rem - 3.25 * 3.2rem = 2.0273rem - 10.4rem = -8.3727rem (negativo, lo que significa que la expresión fluida parte de un valor bajo)

La fórmula final:

```css
h1 {
  font-size: clamp(2.0273rem, -8.3727rem + 3.25vw, 3.8147rem);
}
```

Este valor negativo en la intersección es normal; la parte `3.25vw` crece lo suficiente para que en viewports grandes el resultado se acerque al máximo.

### Ejemplo para h2

- Móvil: 1.8020rem
- Escritorio: 3.0518rem
- Diferencia: 1.2498rem
- Pendiente = 1.2498 / 55 * 100 = 2.2723
- Intersección = 1.8020 - 2.2723 * 3.2 = 1.8020 - 7.2714 = -5.4694rem

```css
h2 {
  font-size: clamp(1.8020rem, -5.4694rem + 2.2723vw, 3.0518rem);
}
```

### Ejemplo para párrafo (base)

- Móvil: 1rem
- Escritorio: 1rem (no cambia)

No necesita clamp, aunque podrías aplicar un ligero crecimiento: `clamp(1rem, 0.5rem + 0.5vw, 1.1rem)`. Pero si quieres mantenerlo fijo, usa `font-size: 1rem`.

## ¿Por qué usar `rem` en lugar de `px`?

Mobile Always enfatiza que todos los valores deben escribirse en `rem`. La razón es que `rem` respeta la configuración de tamaño de fuente del usuario en el navegador. Si un usuario ha aumentado la fuente base a 20px, `1rem` será 20px, y toda la escala se ajustará proporcionalmente. Usar `px` bloquearía esa personalización y rompería la accesibilidad.

Además, al trabajar con `rem`, los cálculos de `vw` se combinan correctamente: `vw` es relativo al viewport, y `rem` es relativo a la raíz. La mezcla es predecible.

## Beneficios de eliminar media queries tipográficas

- **Transición suave**: ningún salto visible al cruzar un breakpoint.
- **Menos código**: no necesitas repetir `font-size` para cada punto de corte.
- **Mantenible**: cambiar la escala solo requiere ajustar los valores en un único lugar.
- **Escalable**: funciona en cualquier ancho de pantalla, incluso en dispositivos intermedios que antes quedaban desatendidos.

## Consideraciones prácticas en WordPress

Si trabajas con WordPress, puedes implementar `clamp()` directamente en el archivo `style.css` de tu tema o mediante el personalizador. Asegúrate de que el tema use unidades `rem` para todo el texto. En bloques Gutenberg, algunos temas permiten añadir CSS adicional.

No olvides definir un tamaño de fuente base en el `html`:

```css
html {
  font-size: 100%; /* 16px por defecto, respeta preferencias */
}
```

Luego, para cada elemento tipográfico, aplica la fórmula correspondiente. Puedes agruparlos en un solo bloque o usar preprocesadores como Sass para generarlos automáticamente.

## Conclusión

La tipografía fluida con `clamp()` resuelve el problema de los saltos de tamaño al cambiar de dispositivo. La propuesta de Mobile Always de usar dos escalas modulares (1.125 para móvil y 1.25 para escritorio) evita que los encabezados sean excesivos en pantallas pequeñas, y la fórmula de interpolación lineal garantiza una transición coherente. Al expresar todo en `rem`, se preserva la accesibilidad y la personalización del usuario.

Ahora tienes una metodología clara: elige los niveles de tu escala, calcula la pendiente y la intersección, y escribe `clamp()` con los valores obtenidos. Olvídate de las media queries tipográficas y ofrece una experiencia de lectura realmente adaptable.

## Preguntas frecuentes

### ¿Puedo usar `clamp()` con porcentajes o `em`?
Sí, pero `rem` es más predecible. `em` puede heredar tamaños del padre y complicar la fluidez.

### ¿Qué viewports usar para el cálculo?
Lo ideal es tomar el mínimo de tu diseño (320px) y el máximo (1200px o 1440px). Ajusta según tu audiencia.

### ¿Funciona en navegadores antiguos?
`clamp()` tiene soporte en todos los navegadores modernos. Para versiones muy antiguas, puedes ofrecer un fallback con `font-size` fijo.

### ¿Cómo manejar títulos muy largos en móvil?
El tamaño mínimo que defines con `clamp()` evita que el texto sea demasiado pequeño. Si aún así un título ocupa varias líneas, revisa la jerarquía: reduce un nivel (pasar de h1 a h2) o usa `word-break`.

### ¿Es necesario calcular manualmente cada nivel?
Puedes usar herramientas online o scripts que generen los valores automáticamente a partir de las dos escalas. Pero entender el cálculo te permite ajustes precisos.