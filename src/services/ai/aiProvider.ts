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

export interface BrandConsistencyResult {
  score: number; // 0 - 100
  strengths: string[];
  violations: string[];
  suggestion: string;
}

export interface AIProvider {
  id: string;
  name: string;
  generateStrategy(client: Client): Promise<StrategistOutput>;
  generateCampaign(client: Client, campaignType: CampaignType, focusTopic?: string): Promise<Campaign>;
  generateContent(
    client: Client,
    options: {
      platform: 'Instagram' | 'WhatsApp' | 'Facebook' | 'Google Business' | 'YouTube';
      contentType: ContentType;
      tone: Tone;
      language: Language;
      promptOverride?: string;
      campaignFocus?: string;
    }
  ): Promise<ContentItem>;
  generateOffers(client: Client, productId?: string, offerType?: string): Promise<Offer>;
  repurposeContent(client: Client, originalContent: ContentItem, targetType: ContentType): Promise<ContentItem>;
  getDailyRecommendations(client: Client): Promise<ProactiveRecommendation[]>;
  analyzeBrandConsistency(client: Client, copyText: string): Promise<BrandConsistencyResult>;
}
