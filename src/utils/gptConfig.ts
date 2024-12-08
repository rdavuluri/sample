import { z } from 'zod';
import { ModelType } from '../types/chat';

// Schema validation for GPT configuration
export const GPTConfigSchema = z.object({
  modelId: z.string(),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(32000),
  description: z.string(),
  contextWindow: z.number(),
  costPer1kTokens: z.number(),
  features: z.array(z.string()),
  capabilities: z.record(z.string(), z.number()),
  category: z.enum(['premium', 'standard', 'custom']),
  responseSpeed: z.enum(['fast', 'balanced', 'thorough']),
  defaultSystemPrompt: z.string().optional(),
});

export type GPTConfig = z.infer<typeof GPTConfigSchema>;

// Extended model configurations
export const MODEL_CONFIGS: Record<ModelType, GPTConfig> = {
  'GPT-4o': {
    modelId: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4000,
    description: 'Most capable GPT-4 model for advanced reasoning and analysis',
    contextWindow: 8192,
    costPer1kTokens: 0.03,
    features: [
      'Advanced reasoning',
      'Complex analysis',
      'Code generation',
      'Creative writing'
    ],
    capabilities: {
      reasoning: 0.95,
      creativity: 0.85,
      knowledge: 0.9,
      coding: 0.9
    },
    category: 'premium',
    responseSpeed: 'thorough',
    defaultSystemPrompt: 'You are an advanced AI assistant with exceptional capabilities in reasoning and analysis.'
  },
  'GPT-4': {
    modelId: 'gpt-4',
    temperature: 0.5,
    maxTokens: 3000,
    description: 'Balanced GPT-4 model for general purpose use',
    contextWindow: 8192,
    costPer1kTokens: 0.03,
    features: [
      'Balanced performance',
      'General tasks',
      'Documentation',
      'Analysis'
    ],
    capabilities: {
      reasoning: 0.9,
      creativity: 0.8,
      knowledge: 0.9,
      coding: 0.85
    },
    category: 'premium',
    responseSpeed: 'balanced',
    defaultSystemPrompt: 'You are a balanced AI assistant optimized for general-purpose tasks.'
  },
  'GPT-3.5': {
    modelId: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    description: 'Fast and efficient for most tasks',
    contextWindow: 4096,
    costPer1kTokens: 0.002,
    features: [
      'Quick responses',
      'Basic tasks',
      'Chat interactions',
      'Simple queries'
    ],
    capabilities: {
      reasoning: 0.8,
      creativity: 0.75,
      knowledge: 0.8,
      coding: 0.7
    },
    category: 'standard',
    responseSpeed: 'fast',
    defaultSystemPrompt: 'You are a quick and efficient AI assistant focused on providing clear and concise responses.'
  },
  'GPT-O1': {
    modelId: 'gpt-3.5-turbo',
    temperature: 0.9,
    maxTokens: 2000,
    description: 'Creative variant with higher temperature',
    contextWindow: 4096,
    costPer1kTokens: 0.002,
    features: [
      'Creative writing',
      'Brainstorming',
      'Story generation',
      'Exploration'
    ],
    capabilities: {
      reasoning: 0.75,
      creativity: 0.9,
      knowledge: 0.8,
      coding: 0.7
    },
    category: 'standard',
    responseSpeed: 'balanced',
    defaultSystemPrompt: 'You are a creative AI assistant specializing in generating unique and imaginative content.'
  },
  'Custom': {
    modelId: 'gpt-4',
    temperature: 0.8,
    maxTokens: 4000,
    description: 'Customizable model settings',
    contextWindow: 8192,
    costPer1kTokens: 0.03,
    features: [
      'Customizable parameters',
      'Flexible usage',
      'Adaptable settings',
      'User-defined behavior'
    ],
    capabilities: {
      reasoning: 0.9,
      creativity: 0.85,
      knowledge: 0.9,
      coding: 0.85
    },
    category: 'custom',
    responseSpeed: 'balanced',
    defaultSystemPrompt: 'You are a customizable AI assistant adapting to specific user requirements.'
  }
};

// Configuration Store with enhanced validation and error handling
export class ConfigurationStore {
  private static instance: ConfigurationStore;
  private customConfigs: Map<string, GPTConfig> = new Map();
  private configChangeListeners: Set<(configs: Map<string, GPTConfig>) => void> = new Set();

  private constructor() {
    this.loadPersistedConfigs();
  }

  static getInstance(): ConfigurationStore {
    if (!ConfigurationStore.instance) {
      ConfigurationStore.instance = new ConfigurationStore();
    }
    return ConfigurationStore.instance;
  }

  private loadPersistedConfigs(): void {
    try {
      const persistedConfigs = localStorage.getItem('customGPTConfigs');
      if (persistedConfigs) {
        const configs = JSON.parse(persistedConfigs);
        Object.entries(configs).forEach(([name, config]) => {
          try {
            this.addCustomConfig(name, config as GPTConfig);
          } catch (error) {
            console.error(`Failed to load persisted config ${name}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load persisted configs:', error);
    }
  }

  private persistConfigs(): void {
    try {
      const configs = Object.fromEntries(this.customConfigs);
      localStorage.setItem('customGPTConfigs', JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to persist configs:', error);
    }
  }

  addCustomConfig(name: string, config: GPTConfig): void {
    try {
      const validatedConfig = GPTConfigSchema.parse(config);
      this.customConfigs.set(name, validatedConfig);
      this.persistConfigs();
      this.notifyConfigChange();
    } catch (error) {
      throw new Error(`Invalid configuration for ${name}: ${error.message}`);
    }
  }

  updateCustomConfig(name: string, updates: Partial<GPTConfig>): void {
    const existing = this.customConfigs.get(name);
    if (!existing) {
      throw new Error(`Configuration ${name} not found`);
    }

    try {
      const updated = { ...existing, ...updates };
      const validatedConfig = GPTConfigSchema.parse(updated);
      this.customConfigs.set(name, validatedConfig);
      this.persistConfigs();
      this.notifyConfigChange();
    } catch (error) {
      throw new Error(`Invalid configuration update for ${name}: ${error.message}`);
    }
  }

  removeCustomConfig(name: string): boolean {
    const result = this.customConfigs.delete(name);
    if (result) {
      this.persistConfigs();
      this.notifyConfigChange();
    }
    return result;
  }

  getCustomConfig(name: string): GPTConfig | undefined {
    return this.customConfigs.get(name);
  }

  getAllCustomConfigs(): Map<string, GPTConfig> {
    return new Map(this.customConfigs);
  }

  subscribeToConfigChanges(listener: (configs: Map<string, GPTConfig>) => void): () => void {
    this.configChangeListeners.add(listener);
    return () => this.configChangeListeners.delete(listener);
  }

  private notifyConfigChange(): void {
    this.configChangeListeners.forEach(listener => listener(this.customConfigs));
  }
}

export const configStore = ConfigurationStore.getInstance();

// Enhanced model configuration getter with caching
const configCache = new Map<ModelType, GPTConfig>();

export const getModelConfig = (model: ModelType): GPTConfig => {
  if (configCache.has(model)) {
    return configCache.get(model)!;
  }

  try {
    const config = MODEL_CONFIGS[model] ?? MODEL_CONFIGS['GPT-3.5'];
    const validatedConfig = GPTConfigSchema.parse(config);
    configCache.set(model, validatedConfig);
    return validatedConfig;
  } catch (error) {
    console.error(`Invalid configuration for model ${model}:`, error);
    return MODEL_CONFIGS['GPT-3.5'];
  }
};

// Model capability checks with enhanced type safety
export const isGPT4Model = (model: ModelType): boolean => {
  const config = getModelConfig(model);
  return config.category === 'premium' || model === 'Custom';
};

export const getModelCapability = (
  model: ModelType,
  capability: keyof GPTConfig['capabilities']
): number => {
  const config = getModelConfig(model);
  return config.capabilities[capability] ?? 0;
};

export const getModelFeatures = (model: ModelType): string[] => {
  return getModelConfig(model).features;
};

// Enhanced cost estimation with validation
export const estimateTokenCost = (model: ModelType, tokenCount: number): number => {
  if (tokenCount < 0) {
    throw new Error('Token count must be non-negative');
  }
  const config = getModelConfig(model);
  return (tokenCount / 1000) * config.costPer1kTokens;
};

// Context window validation with detailed feedback
export const validateContextSize = (
  model: ModelType,
  tokenCount: number
): { valid: boolean; remaining: number } => {
  const config = getModelConfig(model);
  const remaining = config.contextWindow - tokenCount;
  return {
    valid: tokenCount <= config.contextWindow,
    remaining: Math.max(0, remaining)
  };
};
