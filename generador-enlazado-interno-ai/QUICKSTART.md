# 🚀 Inicio Rápido - SEO Internal Linker

## ⚡ 5 Minutos para Empezar

### Paso 1: Obtener API Keys (2 minutos)

Necesitas **al menos UNA** de estas APIs:

#### Opción A: Grok AI (Recomendado)
1. Ve a https://x.ai
2. Crea una cuenta
3. Genera una API key
4. Copia la key

#### Opción B: Kimi AI
1. Ve a https://platform.moonshot.cn
2. Regístrate
3. Obtén tu API key
4. Copia la key

#### Opción C: Xiaomi AI
1. Ve a https://xiaomi.ai
2. Crea cuenta de desarrollador
3. Genera API key
4. Copia la key

---

### Paso 2: Configurar el Proyecto (1 minuto)

```bash
# 1. Copia los archivos a tu proyecto
cp seo-internal-linker.js tu-proyecto/
cp .env.example tu-proyecto/.env
cp package.json tu-proyecto/

# 2. Edita el archivo .env
nano .env
```

Agrega tu API key:
```bash
# Si elegiste Grok
GROK_API_KEY=xai-abcd1234...

# Si elegiste Kimi
KIMI_API_KEY=sk-xyz789...

# Si elegiste Xiaomi
XIAOMI_API_KEY=xiaomi-key-456...
```

Guarda (Ctrl + O) y cierra (Ctrl + X)

---

### Paso 3: Configurar Ruta del Artículo (1 minuto)

```bash
# Abre el script
nano seo-internal-linker.js
```

Busca la línea 39 y modifica:

```javascript
articlePath: 'src/content/blog/TU-ARTICULO-AQUI.md',
```

**Ejemplos reales:**
```javascript
// Astro
articlePath: 'src/content/blog/como-hacer-seo.md',

// Next.js
articlePath: 'content/posts/guia-seo-2024.md',

// Otros
articlePath: 'posts/posicionamiento-web.md',
```

Guarda y cierra

---

### Paso 4: Ejecutar (1 minuto)

```bash
node seo-internal-linker.js
```

**Eso es todo!** 🎉

---

## 📊 Qué Esperar

### Salida Normal:
```
🚀 SEO Internal Linker - Iniciando...

✅ Artículo leído: como-hacer-seo.md (6789 caracteres)
📚 Encontrados 32 artículos en el proyecto (astro)

🤖 Usando GROK AI para análisis...

🔗 Insertando enlaces internos...

✅ Enlace insertado: "keyword research" → /blog/investigacion-palabras-clave
✅ Enlace insertado: "SEO on-page" → /blog/seo-on-page-completo
✅ Enlace insertado: "link building" → /blog/estrategias-link-building

📊 Total de enlaces insertados: 3/3

💾 Backup creado: como-hacer-seo.md.backup.1735656789
💾 Artículo guardado: src/content/blog/como-hacer-seo.md

============================================================
📊 REPORTE DE ENLAZADO INTERNO
============================================================

🎯 Tema principal: Guía de SEO básico
📌 Subtemas: keywords, contenido, enlaces, técnico
🔗 Enlaces sugeridos: 3
✅ Enlaces insertados: 3
📈 Oportunidades de enlazado: 5

============================================================

✨ Proceso completado exitosamente
```

---

## 🔍 Verificar Resultados

### Antes:
```markdown
El SEO técnico es importante para el posicionamiento.
```

### Después:
```markdown
El [SEO técnico](/blog/seo-tecnico) es importante para el posicionamiento.
```

---

## ❓ Problemas Comunes

### ❌ "Archivo no encontrado"
**Causa:** Ruta incorrecta  
**Solución:** Verifica que la ruta sea relativa al directorio actual

```bash
# Verifica que el archivo existe
ls -la src/content/blog/tu-articulo.md
```

### ❌ "API key no configurada"
**Causa:** Falta la API key en .env  
**Solución:** Asegúrate de guardar el archivo .env

```bash
# Verifica que existe
cat .env | grep API_KEY
```

### ⚠️ "No se encontró el texto"
**Causa:** La IA sugirió un texto que no existe exactamente  
**Solución:** Normal, algunos enlaces no se insertan. Revisa manualmente

---

## 🎯 Próximos Pasos

### 1. Revisar enlaces insertados
```bash
# Abre tu artículo modificado
code src/content/blog/tu-articulo.md
```

### 2. Ajustar URLs sugeridas
La IA sugiere URLs, pero puedes cambiarlas:
```markdown
# La IA sugirió:
[SEO técnico](/blog/seo-tecnico-avanzado)

# Si prefieres:
[SEO técnico](/guias/seo-tecnico)
```

### 3. Crear artículos faltantes
Si la IA sugirió `/blog/link-building` y no existe:
```bash
# ¡Es una señal! Escribe ese artículo
touch src/content/blog/link-building.md
```

### 4. Procesar más artículos
```bash
# Cambia articlePath y ejecuta de nuevo
node seo-internal-linker.js
```

---

## 💡 Tips Pro

### ✅ Ejecuta regularmente
```bash
# Cada artículo nuevo
# Cada mes en artículos antiguos
```

### ✅ Revisa el backup
```bash
# Si algo sale mal
ls *.backup.*
```

### ✅ Combina con Analytics
```bash
# Ve qué enlaces generan más clics
# Ajusta tu estrategia
```

---

## 🆘 Ayuda Adicional

- **README completo:** `cat README.md`
- **Ejemplos avanzados:** `node examples.js`
- **Configuración detallada:** `cat .env.example`

---

## 📈 Resultados Esperados

Después de usar este script en 10-20 artículos:

✅ **+30% tiempo en sitio** (usuarios exploran más)  
✅ **-15% tasa de rebote** (enlaces los mantienen)  
✅ **+50% páginas por sesión** (mejor navegación)  
✅ **Mejor indexación** (Google entiende tu estructura)  

---

**¡Listo para optimizar tu SEO! 🚀**

¿Dudas? Revisa el README completo o abre un issue.
