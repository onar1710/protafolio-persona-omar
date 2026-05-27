import dotenv from 'dotenv';
dotenv.config();

export function getConfig() {
  return {
    provider: process.env.AI_PROVIDER || 'grok',
    outputFormat: process.env.OUTPUT_FORMAT || 'mdx',
    promptsDir: process.env.PROMPTS_DIR || './prompts',
    outputDir: process.env.OUTPUT_DIR || './outputs',

    grok: {
      apiKey: process.env.GROK_API_KEY,
      model: process.env.GROK_MODEL || 'grok-beta',
      temperature: parseFloat(process.env.GROK_TEMPERATURE) || 1.0,
      maxTokens: parseInt(process.env.GROK_MAX_TOKENS) || 50000,
      endpoint: 'https://api.x.ai/v1/chat/completions'
    },

    kimi: {
      apiKey: process.env.KIMI_API_KEY,
      model: process.env.KIMI_MODEL || 'kimi-k2.5',
      temperature: parseFloat(process.env.KIMI_TEMPERATURE) || 1.0,
      maxTokens: parseInt(process.env.KIMI_MAX_TOKENS) || 50000,
      endpoint: 'https://api.moonshot.ai/v1/chat/completions'
    },

    mimo: {
      apiKey: process.env.MIMO_API_KEY,
      model: process.env.MIMO_MODEL || 'MiMo-V2.5',
      temperature: parseFloat(process.env.MIMO_TEMPERATURE) || 1.0,
      maxTokens: parseInt(process.env.MIMO_MAX_TOKENS) || 50000,
      timeoutMs: parseInt(process.env.MIMO_TIMEOUT_MS) || parseInt(process.env.AI_TIMEOUT_MS) || 300000,
      endpoint: 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions'
    }
  };
}

// Backwards-compat: existing CLI imports `config` as a constant snapshot.
export const config = getConfig();
