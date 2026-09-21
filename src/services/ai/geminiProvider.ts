import {
  Client,
  Campaign,
  CampaignType,
  ContentItem,
  ContentType,
  Tone,
  Language,
  Offer,
  StrategistOutput,
  ProactiveRecommendation,
} from '../../types';
import { AIProvider, BrandConsistencyResult } from './aiProvider';
import { buildClientContext } from './clientContextBuilder';
import { localAIProvider } from './localProvider';

export class GeminiAIProvider implements AIProvider {
  id = 'gemini';
  name = 'Google Gemini 2.0 / 1.5';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = '', model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async generateStrategy(client: Client): Promise<StrategistOutput> {
    if (!this.apiKey) {
      return localAIProvider.generateStrategy(client);
    }
    try {
      const context = buildClientContext(client);
      const prompt = `You are a world-class retail marketing director. Based on this client context: ${JSON.stringify(context)}, generate a complete marketing strategy in JSON matching the StrategistOutput interface.`;
      const response = await this.callGemini(prompt);
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      return localAIProvider.generateStrategy(client);
    }
  }

  async generateCampaign(client: Client, campaignType: CampaignType, focusTopic?: string): Promise<Campaign> {
    if (!this.apiKey) {
      return localAIProvider.generateCampaign(client, campaignType, focusTopic);
    }
    try {
      const context = buildClientContext(client);
      const prompt = `Act as an agency campaign director. Client context: ${JSON.stringify(context)}. Create a full ${campaignType} campaign for "${focusTopic || 'hero offerings'}" with strategy, Instagram post, WhatsApp broadcast, 30s Reel script, and Google Business update. Return JSON adhering to Campaign.`;
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch {
      return localAIProvider.generateCampaign(client, campaignType, focusTopic);
    }
  }

  async generateContent(
    client: Client,
    options: {
      platform: 'Instagram' | 'WhatsApp' | 'Facebook' | 'Google Business' | 'YouTube';
      contentType: ContentType;
      tone: Tone;
      language: Language;
      promptOverride?: string;
      campaignFocus?: string;
    }
  ): Promise<ContentItem> {
    if (!this.apiKey) {
      return localAIProvider.generateContent(client, options);
    }
    try {
      const context = buildClientContext(client);
      const prompt = `Write ${options.contentType} for ${options.platform}. Client: ${JSON.stringify(context)}. Tone: ${options.tone}. Language: ${options.language}. Focus: ${options.campaignFocus || 'hero product'}. Return JSON adhering to ContentItem.`;
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch {
      return localAIProvider.generateContent(client, options);
    }
  }

  async generateOffers(client: Client, productId?: string, offerType?: string): Promise<Offer> {
    if (!this.apiKey) {
      return localAIProvider.generateOffers(client, productId, offerType);
    }
    try {
      const context = buildClientContext(client);
      const prompt = `Generate a high-converting retail offer for client: ${JSON.stringify(context)}. ProductId: ${productId}, OfferType: ${offerType}. Return JSON adhering to Offer.`;
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch {
      return localAIProvider.generateOffers(client, productId, offerType);
    }
  }

  async repurposeContent(client: Client, originalContent: ContentItem, targetType: ContentType): Promise<ContentItem> {
    return localAIProvider.repurposeContent(client, originalContent, targetType);
  }

  async getDailyRecommendations(client: Client): Promise<ProactiveRecommendation[]> {
    return localAIProvider.getDailyRecommendations(client);
  }

  async analyzeBrandConsistency(client: Client, copyText: string): Promise<BrandConsistencyResult> {
    return localAIProvider.analyzeBrandConsistency(client, copyText);
  }

  private async callGemini(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }
}
