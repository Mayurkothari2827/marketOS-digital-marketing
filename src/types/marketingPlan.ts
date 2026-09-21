export interface BusinessInput {
  businessName: string;
  category: string;
  location: string;
  products: string;
  usp?: string;
  offers?: string;
  targetCustomers?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  phone?: string;
  logoUrl?: string;
  productImages?: string[];
}

export interface StoryFrame {
  frame: number;
  text: string;
  visual: string;
}

export interface ReelScene {
  time: string;
  visual: string;
  audio: string;
}

export interface CampaignContent {
  headline: string;
  primaryCopy: string;
  instagramCaption: string;
  hashtags: string[];
  whatsappMessage: string;
  facebookPost: string;
  storySequence: StoryFrame[];
  reelConcept: {
    hook: string;
    scenes: ReelScene[];
    callToAction: string;
  };
}

export interface CampaignCreative {
  id: string;
  conceptType: 'product' | 'offer' | 'lifestyle';
  label: string;
  headline: string;
  subheadline: string;
  offerBadge: string;
  priceTag?: string;
  originalPrice?: string;
  ctaText: string;
  bgGradient: string;
  accentColor: string;
  productImage?: string;
  showLogo: boolean;
  showContactBar: boolean;
}

export interface CampaignIdea {
  id: string;
  name: string;
  objective: string;
  coreIdea: string;
  targetAudience: string;
  hook: string;
  offer: string;
  keyMessage: string;
  cta: string;
  platforms: string[];
  content: CampaignContent;
  creatives: CampaignCreative[];
}

export interface MarketingStrategy {
  positioning: string;
  targetAudience: string;
  marketingAngle: string;
  contentDirection: string;
  recommendedTone: string;
  assumptionsMade: string[];
}

export interface MarketingPlan {
  id: string;
  businessInput: BusinessInput;
  strategy: MarketingStrategy;
  campaigns: CampaignIdea[];
  createdAt: string;
}
