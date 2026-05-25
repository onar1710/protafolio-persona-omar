# 🔗 SEO Internal Linker - Enlazado Interno Inteligente con IA

Script profesional de enlazado interno que utiliza **Xiaomi AI**, **Grok AI** y **Kimi AI** para generar enlaces internos contextuales y estratégicos en tus artículos de blog.

Compatible con **Astro**, **Next.js** y **Visual Studio Code** projects.

---

## 🎯 Características Principales

✅ **Multi-IA**: Soporta Xiaomi AI, Grok AI y Kimi AI (con fallback automático)  
✅ **Enlaces Contextuales**: Los enlaces aportan valor real y conectan conceptos relacionados  
✅ **Sin Repeticiones**: Nunca usa el mismo texto ancla dos veces  
✅ **Análisis Inteligente**: Detecta automáticamente temas y oportunidades de enlazado  
✅ **Multi-Framework**: Compatible con Astro, Next.js y proyectos VSC  
✅ **Distribución Equilibrada**: Enlaces distribuidos a lo largo del artículo  

---

## 📦 Instalación

### 1. Copiar archivos al proyecto

```bash
# Copiar el script principal
cp seo-internal-linker.js tu-proyecto/

# Copiar configuración de ejemplo
cp .env.example tu-proyecto/.env
```

### 2. Instalar dependencias (si no las tienes)

```bash
cd tu-proyecto
npm install node-fetch
# O si usas Node.js 18+, fetch ya viene incluido
```

### 3. Configurar variables de entorno

Edita el archivo `.env` y agrega **al menos UNA** API key:

```bash
# Opción 1: Xiaomi AI
XIAOMI_API_KEY=tu_api_key_aqui

# Opción 2: Grok AI
GROK_API_KEY=tu_api_key_aqui

# Opción 3: Kimi AI
KIMI_API_KEY=tu_api_key_aqui
```

---

## 🚀 Uso Rápido

### Paso 1: Ejecutar el script con el artículo a procesar

```bash
node seo-internal-linker.js --article "src/content/blog/como-posicionar-mi-web-en-google.md"
```

### Probar sin modificar (dry-run)

```bash
node seo-internal-linker.js --article "src/content/blog/como-posicionar-mi-web-en-google.md" --dry-run
```

### Ejemplo de salida:

```
🚀 SEO Internal Linker - Iniciando...

✅ Artículo leído: como-posicionar-mi-web-en-google.md (8547 caracteres)
📚 Encontrados 45 artículos en el proyecto (astro)

🤖 Usando GROK AI para análisis...

🔗 Insertando enlaces internos...

✅ Enlace insertado: "estrategias de SEO técnico" → /blog/seo-tecnico-avanzado
✅ Enlace insertado: "optimización de velocidad" → /blog/optimizar-velocidad-web
✅ Enlace insertado: "búsqueda por voz" → /blog/seo-busqueda-por-voz
✅ Enlace insertado: "link building efectivo" → /blog/estrategias-link-building
✅ Enlace insertado: "experiencia de usuario" → /blog/ux-seo

📊 Total de enlaces insertados: 5/5

💾 Artículo guardado: src/content/blog/como-posicionar-mi-web-en-google.md

============================================================
📊 REPORTE DE ENLAZADO INTERNO
============================================================

🎯 Tema principal: Posicionamiento web en Google
📌 Subtemas: SEO técnico, contenido, experiencia usuario, link building
🔗 Enlaces sugeridos: 5
✅ Enlaces insertados: 5
📈 Oportunidades de enlazado: 8

============================================================

✨ Proceso completado exitosamente
```

---

## ⚙️ Configuración Avanzada

### Variables de entorno disponibles

```bash
# Seleccionar IA específica (xiaomi, grok, kimi, auto)
PREFERRED_AI=grok

# Controlar cantidad de enlaces
MIN_LINKS=3
MAX_LINKS=8
```

### Personalizar directorios de contenido

Si tu proyecto tiene una estructura diferente, edita las líneas 43-48:

```javascript
contentDirs: {
  astro: ['src/content/blog', 'src/pages/blog'],
  nextjs: ['content/posts', 'posts', 'articles'],
  vsc: ['content', 'posts']
}
```

---

## 🧠 Cómo Funciona el Enlazado Inteligente

### 1. **Análisis del Contenido**
La IA lee tu artículo y extrae:
- Tema principal
- Subtemas relevantes
- Conceptos mencionados que necesitan profundización

### 2. **Identificación de Oportunidades**
Detecta párrafos donde un enlace interno aportaría valor:
- Menciones de conceptos complejos
- Referencias a temas relacionados
- Términos que tienen artículos dedicados

### 3. **Generación de Enlaces Contextuales**
Cada enlace incluye:
- **Texto ancla descriptivo**: 15-40 caracteres específicos
- **URL sugerida**: Basada en el tema (puedes cambiarla)
- **Contexto**: Por qué ese enlace aporta valor
- **Posición**: Dónde va en el artículo

### 4. **Inserción No Repetitiva**
- Verifica que no se use el mismo texto ancla dos veces
- Distribuye enlaces a lo largo del artículo
- Respeta el flujo natural del contenido

---

## 📋 Ejemplo de Enlaces Generados

### Antes:
```markdown
El SEO técnico es fundamental para el posicionamiento. La velocidad 
de carga influye directamente en el ranking de Google. Es importante
optimizar las imágenes y usar lazy loading.
```

### Después:
```markdown
El [SEO técnico](/blog/seo-tecnico-avanzado) es fundamental para el 
posicionamiento. La [velocidad de carga](/blog/optimizar-velocidad-web) 
influye directamente en el ranking de Google. Es importante optimizar 
las imágenes y usar [lazy loading](/blog/lazy-loading-imagenes).
```

---

## 🎨 Mejores Prácticas Implementadas

### ✅ Texto Ancla Descriptivo
```markdown
❌ MAL:  [haz clic aquí](/blog/seo)
✅ BIEN: [estrategias de SEO técnico](/blog/seo-tecnico)
```

### ✅ Enlaces que Aportan Contexto
```markdown
La arquitectura web afecta el rastreo de Google. Para obtener más 
información sobre las estructuras de sitio optimizadas, consulta 
nuestra [guía para sitios de comercio electrónico](/blog/seo-ecommerce).
```

### ✅ Distribución Natural
```markdown
Inicio del artículo: 1-2 enlaces
Medio del artículo: 3-4 enlaces  
Final del artículo: 1-2 enlaces
```

### ✅ No Repetición
```markdown
❌ MAL:  
  - [SEO](/blog/seo-guia)
  - [SEO](/blog/seo-tecnico)  <- Repetido

✅ BIEN: 
  - [guía completa de SEO](/blog/seo-guia)
  - [SEO técnico avanzado](/blog/seo-tecnico)  <- Diferente
```

---

## 🔧 Troubleshooting

### Error: "Archivo no encontrado"
```bash
❌ Error al leer el artículo: Archivo no encontrado

Solución: Verifica que la ruta sea relativa al directorio donde ejecutas el script
```

### Error: "API key no configurada"
```bash
❌ API key no configurada para GROK

Solución: Agrega tu API key en el archivo .env
GROK_API_KEY=tu_api_key_aqui
```

### No se insertan enlaces
```bash
⚠️ No se encontró el texto: "estrategias avanzadas"

Causa: La IA sugirió un texto ancla que no existe exactamente en tu artículo
Solución: El script muestra qué textos no se encontraron. Puedes:
1. Ajustar manualmente esos enlaces
2. Ejecutar nuevamente (la IA dará diferentes sugerencias)
```

---

## 🌟 Casos de Uso

### 1. Artículo Nuevo
```bash
node seo-internal-linker.js --article "src/content/blog/nuevo-articulo-seo.md"
```

### 2. Actualizar Artículo Antiguo
```bash
node seo-internal-linker.js --article "src/content/blog/articulo-2023.md"
```

### 3. Batch Processing (próximamente)
```bash
# Procesar múltiples artículos
# npm run link-all
```

---

## 📊 Optimización SEO

Este script implementa las mejores prácticas de Google:

1. **Contexto Descriptivo**: Los enlaces proporcionan información sobre la página enlazada
2. **Valor para Usuarios**: Conectan conceptos relacionados
3. **Rastreo Eficiente**: Estructura de enlaces ayuda a Google a entender el sitio
4. **Experiencia de Usuario**: Enlaces relevantes mantienen al usuario en el sitio

### Referencia: Guía de Google
> "Los enlaces pueden proporcionar más contexto sobre el tema, tanto para 
> los usuarios como para los buscadores" 
> — [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

---

## 🔒 Seguridad

- ✅ Las API keys se mantienen en `.env` (no subir a Git)
- ✅ El script solo modifica el archivo especificado
- ✅ Logging completo de todas las operaciones

### Agregar .env al .gitignore
```bash
echo ".env" >> .gitignore
```

---

## 📈 Roadmap

- [ ] Soporte para procesamiento batch
- [ ] Análisis de densidad de enlaces
- [ ] Sugerencias de nuevos artículos basados en gaps
- [ ] Integración con Google Search Console
- [ ] Dashboard web para visualización
- [ ] CLI interactivo

---

## 🤝 Contribuciones

¿Mejoras o ideas? ¡Pull requests bienvenidos!

---

## 📄 Licencia

MIT License - Úsalo libremente en tus proyectos

---

## 💡 Tips Profesionales

### 1. Ejecuta el script periódicamente
```bash
# Cada vez que publiques un artículo nuevo
# Revisa artículos antiguos mensualmente
```

### 2. Revisa las sugerencias
```bash
# La IA es inteligente pero no perfecta
# Revisa los enlaces antes de publicar
```

### 3. Crea artículos para enlaces sugeridos
```bash
# Si la IA sugiere /blog/seo-local y no existe
# ¡Es una señal de que deberías escribirlo!
```

### 4. Combina con análisis de datos
```bash
# Usa Google Analytics para ver qué enlaces funcionan
# Ajusta tu estrategia de contenido
```

---

**¿Preguntas?** Abre un issue o consulta la documentación de las APIs:
- [Xiaomi AI Docs](https://xiaomi.ai/docs)
- [Grok AI Docs](https://docs.x.ai)
- [Kimi AI Docs](https://platform.moonshot.cn)

---

**Hecho con ❤️ para optimizadores SEO**
