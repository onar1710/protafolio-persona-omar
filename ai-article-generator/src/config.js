import dotenv from 'dotenv';
dotenv.config();

export function getConfig() {
  const rawProvider = String(process.env.AI_PROVIDER || 'grok').trim().toLowerCase();
  const provider =
    rawProvider === 'grok' || rawProvider.startsWith('grok-') || rawProvider.startsWith('xai')
      ? 'grok'
      : rawProvider === 'kimi' || rawProvider.startsWith('kimi-') || rawProvider.startsWith('moonshot')
        ? 'kimi'
        : rawProvider === 'mimo' || rawProvider.startsWith('mimo')
          ? 'mimo'
          : rawProvider === 'deepseek' || rawProvider.startsWith('deepseek')
            ? 'deepseek'
            : rawProvider;

  const mimoModel = process.env.MIMO_MODEL || (provider === 'mimo' && rawProvider !== 'mimo' ? rawProvider : '') || 'MiMo-V2.5';
  return {
    provider,
    outputFormat: String(process.env.OUTPUT_FORMAT || 'md').trim().toLowerCase(),
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
      model: mimoModel,
      temperature: parseFloat(process.env.MIMO_TEMPERATURE) || 1.0,
      maxTokens: parseInt(process.env.MIMO_MAX_TOKENS) || 50000,
      timeoutMs: parseInt(process.env.MIMO_TIMEOUT_MS) || parseInt(process.env.AI_TIMEOUT_MS) || 300000,
      endpoint: 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions'
    },

    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 1.0,
      maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 8000,
      endpoint: 'https://api.deepseek.com/v1/chat/completions'
    }
  };
}

// Backwards-compat: existing CLI imports `config` as a constant snapshot.
export const config = getConfig();
