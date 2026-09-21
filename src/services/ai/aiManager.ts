import { AIProvider } from './aiProvider';
import { localAIProvider } from './localProvider';
import { GeminiAIProvider } from './geminiProvider';
import { AIProviderConfig } from '../../types';

class AIManager {
  private activeConfig: AIProviderConfig = {
    provider: 'local',
    apiKey: '',
    modelName: 'Built-in Local Intelligence',
  };

  private geminiProvider: GeminiAIProvider = new GeminiAIProvider();

  constructor() {
    // Load config from localStorage if available
    try {
      const saved = localStorage.getItem('marketos_ai_config');
      if (saved) {
        this.activeConfig = JSON.parse(saved);
        if (this.activeConfig.apiKey && this.activeConfig.provider === 'gemini') {
          this.geminiProvider.setApiKey(this.activeConfig.apiKey);
        }
      }
    } catch {
      // fallback to local default
    }
  }

  getConfig(): AIProviderConfig {
    return { ...this.activeConfig };
  }

  setConfig(config: AIProviderConfig) {
    this.activeConfig = config;
    if (config.apiKey && config.provider === 'gemini') {
      this.geminiProvider.setApiKey(config.apiKey);
    }
    localStorage.setItem('marketos_ai_config', JSON.stringify(config));
  }

  getProvider(): AIProvider {
    if (this.activeConfig.provider === 'gemini' && this.activeConfig.apiKey) {
      return this.geminiProvider;
    }
    return localAIProvider;
  }
}

export const aiManager = new AIManager();
