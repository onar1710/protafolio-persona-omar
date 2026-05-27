# AI Article Generator

Sistema modular de generación de artículos con IA para Astro.js.

## Instalación

```bash
npm install
cp .env.example .env
```

## Configuración

Edita `.env`:

```env
AI_PROVIDER=grok
GROK_API_KEY=tu_key
OUTPUT_FORMAT=mdx
xiaomi api
kimi api 
```

## Uso

1. Crea un archivo `.txt` en `/prompts/` con tus instrucciones completas
2. Ejecuta:

```bash
npm run generate
```
```

## APIs soportadas

- **Grok** (x.ai)
- **Kimi** (moonshot)
- **Mimo** (xiaomi)

## Arquitectura

- `ai-client.js` → Cliente unificado de APIs
- `prompt-reader.js` → Lector de archivos .txt
- `file-generator.js` → Generador de archivos markdown
- `generator.js` → Orquestador principal
- `config.js` → Configuración centralizada

El sistema NO impone estructura editorial. Todo viene del `.txt`.
