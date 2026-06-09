# 🤖 AI Article Generator

Generador inteligente de artículos para blog usando IA, con análisis de perfil de sitio y extracción de fragmentos textuales.

---

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Proveedores Soportados](#proveedores-soportados)
5. [Cómo Usar](#cómo-usar)
6. [Opciones del Menú](#opciones-del-menú)
7. [Reglas de Títulos](#reglas-de-títulos)
8. [Metodología de Extracción](#metodología-de-extracción)
9. [Estructura del Proyecto](#estructura-del-proyecto)
10. [Validaciones Automáticas](#validaciones-automáticas)

---

## ✨ Características

- ✅ **Análisis de perfil de sitio** - Lee `PERFIL_SITIO.md` para generar ideas adaptadas a tu nicho
- ✅ **Extracción de fragmentos textuales** - Ideas basadas en fragmentos REALES de la fuente
- ✅ **3 proveedores de IA** - Grok, Kimi, Mimo (intercambiables)
- ✅ **Validación automática** - Títulos, longitud, caracteres prohibidos, fragmentos textuales
- ✅ **Generación de planes JSON** - Estructura completa antes de escribir
- ✅ **Generación de artículos MDX/MD** - Con frontmatter automático
- ✅ **Menú interactivo** - Fácil de usar sin comandos complejos

---

## 🚀 Instalación

```bash
cd ai-article-generator
npm install
```

---

## ⚙️ Configuración

### 1. Copiar plantilla de configuración

```bash
cp .env.example .env
```

### 2. Editar `.env` con tus API keys

```env
# Proveedor activo: grok | kimi | mimo
AI_PROVIDER=grok

# Formato de salida: md | mdx
OUTPUT_FORMAT=mdx

# Directorios
PROMPTS_DIR=./prompts
OUTPUT_DIR=./outputs

# Timeouts
AI_TIMEOUT_MS=300000

# === GROK (X.AI) ===
GROK_API_KEY=tu_api_key_aqui
GROK_MODEL=grok-beta
GROK_TEMPERATURE=1.0
GROK_MAX_TOKENS=50000

# === KIMI (Moonshot AI) ===
KIMI_API_KEY=tu_api_key_aqui
KIMI_MODEL=kimi-k2.5
KIMI_TEMPERATURE=1.0
KIMI_MAX_TOKENS=50000

# === MIMO (XiaoMi) ===
MIMO_API_KEY=tu_api_key_aqui
MIMO_MODEL=MiMo-V2.5
MIMO_TEMPERATURE=1.0
MIMO_MAX_TOKENS=50000
MIMO_TIMEOUT_MS=300000
```

### 3. Obtener API Keys

- **GROK:** https://console.x.ai/
- **KIMI:** https://platform.moonshot.cn/
- **MIMO:** https://xiaomimimo.com/

Ver guía detallada en: `CONFIGURACION_ENV.md`

---

## 🔌 Proveedores Soportados

| Proveedor | Comando | Características |
|-----------|---------|----------------|
| **GROK** | `AI_PROVIDER=grok` | Rápido, general purpose |
| **KIMI** | `AI_PROVIDER=kimi` | Contexto amplio (128k tokens) |
| **MIMO** | `AI_PROVIDER=mimo` | Multilingüe, contexto 200k |

Para cambiar de proveedor, solo modifica `AI_PROVIDER` en `.env`

---

## 💻 Cómo Usar

### Ejecución Simple

```bash
npm run generate
```

Esto abre un menú interactivo con 3 opciones:

```
Selecciona una opción:
  1) Analizar artículo (.md) y guardar investigación (JSON) en /out
  2) Generar artículos desde una investigación (JSON) en /out
  3) Analizar fuente original con perfil del sitio y generar ideas
  0) Salir
```

---

## 📋 Opciones del Menú

### Opción 1: Analizar Artículo Existente

**¿Qué hace?**
- Lee un artículo `.md` existente de tu blog
- Analiza el contenido
- Genera un plan JSON con ideas relacionadas
- Guarda en `out/analysis-[slug]-[timestamp].json`

**Flujo:**
1. Selecciona idioma (es/en)
2. Elige artículo de la lista
3. Espera el análisis
4. JSON guardado en `/out`

---

### Opción 2: Generar Artículos desde JSON

**¿Qué hace?**
- Lee un plan JSON de `/out`
- Genera artículos MDX/MD completos
- Guarda en el directorio configurado

**Flujo:**
1. Selecciona idioma (es/en)
2. Elige JSON de la lista
3. Confirma directorio de salida
4. Artículos generados

---

### Opción 3: Analizar Fuente con Perfil del Sitio ⭐ NUEVA

**¿Qué hace?**
- Lee `PERFIL_SITIO.md` (ADN de tu sitio)
- Lee `fuente-original-analisis.txt` (contenido fuente)
- Cruza ambos para generar ideas únicas y adaptadas
- Guarda JSON en `out/ideas-[timestamp].json`

**Flujo:**
1. Coloca contenido en `fuente-original-analisis.txt`
2. Ejecuta `npm run generate`
3. Selecciona opción 3
4. Elige idioma
5. Espera análisis (lee perfil + fuente + artículos existentes)
6. JSON con ideas guardado en `/out`

**Características únicas:**
- ✅ Extrae fragmentos textuales REALES de la fuente
- ✅ Justifica por qué cada idea es relevante
- ✅ Evita duplicar artículos existentes
- ✅ Genera ideas con ángulos únicos

---

## 📏 Reglas de Títulos

### ✅ Obligatorio

- **Longitud:** 60-74 caracteres (estricto)
- **Específicos:** Atacan un problema concreto
- **Beneficio claro:** Prometen solución o revelación
- **Keywords:** Incluyen keyword principal

### ❌ Prohibido

- Caracteres: `:` `,` `?` `¿`
- Años: 2024, 2025, 2026
- Palabras genéricas: "Guía", "Tutorial", "Manual", "Completa"
- Títulos genéricos o amplios

### 💡 Ejemplos

**❌ MALO:**
```
Impresiones de IA sin clics (29 chars - muy corto)
Guía Completa de SEO 2026 (27 chars - año, genérico, palabra prohibida)
La verdad sobre tus métricas de Search Console e impresiones de IA distorsionadas (84 chars - muy largo, Google trunca)
```

**✅ BUENO:**
```
Por qué las impresiones de IA en Search Console no generan tráfico real (74 chars)
Search Console separa datos de IA y revela métricas distorsionadas (70 chars)
Tu visibilidad en IA fluctúa cada hora y así afecta tu estrategia (69 chars)
```

Ver guía completa en: `REGLAS_TITULOS.md`

---

## 🔍 Metodología de Extracción

### Principio Fundamental

**NO INVENTES, EXTRAE**

Cada idea DEBE basarse en un fragmento textual REAL extraído de la fuente.

### Campos Obligatorios

```json
{
  "fragmento_textual_fuente": "COPIA EXACTA del texto fuente",
  "por_que_genera_idea": "Qué revela este fragmento (implicación oculta)",
  "por_que_encaja_perfil": "Cómo ayuda a la audiencia del sitio"
}
```

### Proceso

1. **Leer** sourceContent línea por línea
2. **Identificar** fragmentos con implicaciones ocultas
3. **Copiar** el fragmento exacto (no parafrasear)
4. **Analizar** qué revela que no es obvio
5. **Explicar** cómo afecta a la audiencia del sitio
6. **Generar** título basado en esa revelación

Ver metodología completa en: `METODOLOGIA_EXTRACCION.md`

---

## 📁 Estructura del Proyecto

```
ai-article-generator/
├── .env                          # Tu configuración (NO subir a Git)
├── .env.example                  # Plantilla de configuración
├── .gitignore                    # Git ignore (.env incluido)
├── package.json                  # Dependencias
├── README.md                     # Este archivo
│
├── src/                          # Código fuente
│   ├── generator.js              # CLI principal
│   ├── ai-client.js              # Cliente IA unificado
│   ├── config.js                 # Configuración de proveedores
│   ├── prompt-reader.js          # Lectura de prompts
│   ├── file-generator.js         # Generación de archivos
│   └── generate-article.js       # Helper de generación
│
├── prompts/                      # Prompts para la IA
│   ├── promts.txt                # Prompt de generación
│   └── promts-analysis.txt       # Prompt de análisis ⭐
│
├── out/                          # JSONs generados (auto)
│   ├── analysis-*.json           # Planes de artículos
│   └── ideas-*.json              # Ideas desde fuente
│
├── fuente-original-analisis.txt  # Tu contenido fuente ⭐
│
└── docs/                         # Documentación
    ├── CONFIGURACION_ENV.md      # Guía de configuración
    ├── REGLAS_TITULOS.md         # Reglas de títulos
    ├── METODOLOGIA_EXTRACCION.md # Metodología de extracción
    └── RESUMEN_CONFIGURACION.md  # Resumen ejecutivo
```

### Archivos Clave

| Archivo | Propósito | ¿Modificar? |
|---------|-----------|-------------|
| `.env` | Tu configuración y API keys | ✅ Sí |
| `fuente-original-analisis.txt` | Contenido fuente para análisis | ✅ Sí |
| `prompts/promts-analysis.txt` | Instrucciones para la IA | ⚙️ Opcional |
| `PERFIL_SITIO.md` (raíz) | ADN de tu sitio | ❌ No (ya creado) |

---

## ✅ Validaciones Automáticas

El sistema valida automáticamente:

### Títulos

- ✅ Longitud: 60-74 caracteres
- ✅ Sin caracteres prohibidos (`:`, `,`, `?`)
- ✅ Sin años (2024-2039)
- ✅ Sin palabras genéricas ("guía", "tutorial")

### Contenido

- ✅ Fragmento textual presente (min 20 caracteres)
- ✅ Justificación presente (min 50 caracteres)
- ✅ Conexión con perfil presente

### Salida de Validación

```bash
📊 Se generaron 8 ideas de artículos

⚠️ 2 idea(s) sin fragmento textual válido
⚠️ 1 idea(s) sin justificación válida

⚠️ ADVERTENCIA: 3 título(s) con problemas:
  - Título 1: Muy corto (45 chars, mín 60)
  - Título 2: Muy largo (82 caracteres)
  - Título 3: Contiene carácter prohibido ":"

💡 Tip: Títulos deben tener 60-74 caracteres y prometer valor específico

# Si todo está perfecto:
✅ Todos los títulos cumplen las reglas
🎉 ¡Perfecto! Todas las ideas tienen fragmentos textuales y justificaciones válidas
```

---

## 🛠️ Uso Avanzado (CLI)

### Analizar Artículo

```bash
node src/generator.js analyze \
  --input "src/content/blog/mi-articulo.md" \
  --lang es \
  --output "out/mi-analisis.json" \
  --maxTitleLen 74
```

### Generar desde Plan

```bash
node src/generator.js generate-plan \
  --plan "out/ideas-2026-06-09.json" \
  --lang es \
  --outDir "src/content/blog"
```

---

## 🔧 Troubleshooting

### Error: "Missing API key"

**Causa:** No configuraste la API key del proveedor seleccionado.

**Solución:**
1. Verifica que `.env` existe
2. Confirma que `AI_PROVIDER` coincide con la key configurada
3. Ejemplo: Si usas `AI_PROVIDER=grok`, necesitas `GROK_API_KEY=...`

### Error: "Request failed with status code 401"

**Causa:** API key inválida o incorrecta.

**Solución:**
1. Verifica que copiaste la key correctamente (sin espacios)
2. Confirma que la key no ha expirado
3. Genera una nueva key en el panel del proveedor

### Títulos muy cortos/largos

**Causa:** La IA no respetó el límite.

**Solución:**
1. El prompt ya está actualizado para forzar 60-74 caracteres
2. Si persiste, regenera con el mismo comando
3. La validación te alertará automáticamente

### Ideas sin fragmentos textuales

**Causa:** La fuente no tiene suficiente contenido.

**Solución:**
1. Agrega más contenido a `fuente-original-analisis.txt`
2. Asegúrate que el contenido tenga datos específicos, no generalidades
3. El prompt fuerza a la IA a extraer fragmentos reales

---

## 📊 Métricas de Calidad

Un buen resultado debe tener:

- ✅ 8-12 ideas generadas
- ✅ 100% de ideas con fragmentos textuales
- ✅ 100% de títulos entre 60-74 caracteres
- ✅ 0 caracteres prohibidos
- ✅ 0 palabras genéricas
- ✅ Cada idea con ángulo único

---

## 🎯 Mejores Prácticas

### Para Mejores Ideas

1. **Contenido fuente rico** - Coloca noticias, estudios, datos específicos
2. **Perfil actualizado** - Mantén `PERFIL_SITIO.md` actualizado
3. **Temperatura balanceada** - 1.0 es el sweet spot
4. **Revisar y regenerar** - Si no te convence, regenera

### Para Mejores Títulos

1. **Específicos** - Ataca un problema concreto
2. **Beneficio claro** - Promete solución o revelación
3. **60-74 caracteres** - Usa el espacio pero no te pases
4. **Sin genéricos** - Evita "guía", "tutorial", "completa"

---

## 📚 Documentación Adicional

- `CONFIGURACION_ENV.md` - Guía completa de configuración
- `REGLAS_TITULOS.md` - Reglas y ejemplos de títulos
- `METODOLOGIA_EXTRACCION.md` - Proceso de extracción de fragmentos
- `RESUMEN_CONFIGURACION.md` - Resumen ejecutivo
- `INSTRUCCIONES_NUEVA_FUNCIONALIDAD.md` - Guía de opción 3

---

## 🆘 Soporte

### Proveedores

- **GROK:** https://docs.x.ai/
- **KIMI:** https://platform.moonshot.cn/docs/
- **MIMO:** Contacto en xiaomimimo.com

### Issues Comunes

Ver sección **Troubleshooting** arriba.

---

## 🔄 Changelog

### v3.0 (Actual)
- ✅ Opción 3: Análisis con perfil del sitio
- ✅ Extracción de fragmentos textuales obligatoria
- ✅ Validación estricta de títulos (60-74 caracteres)
- ✅ Validación de fragmentos y justificaciones
- ✅ Documentación completa

### v2.0
- ✅ Soporte para 3 proveedores (Grok, Kimi, Mimo)
- ✅ Menú interactivo
- ✅ Validación de títulos básica

### v1.0
- ✅ Generación básica de artículos
- ✅ Análisis de artículos existentes

---

## 📄 Licencia

Uso interno del proyecto.

---

## 🚀 Quick Start

```bash
# 1. Instalar
npm install

# 2. Configurar
cp .env.example .env
# Edita .env con tus API keys

# 3. Preparar fuente
# Edita: fuente-original-analisis.txt

# 4. Ejecutar
npm run generate
# Selecciona opción 3
# Elige idioma
# ¡Listo!
```

---

**¿Listo para generar contenido único y original? 🎉**

```bash
npm run generate
```
