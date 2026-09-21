export type Language = 'English' | 'Hindi' | 'Hinglish';

export type Tone = 
  | 'professional'
  | 'premium'
  | 'local'
  | 'hinglish'
  | 'hindi'
  | 'gen-z'
  | 'sales'
  | 'emotional'
  | 'friendly'
  | 'energetic'
  | 'shorter';

export type CampaignType =
  | 'Product Launch'
  | 'Product Promotion'
  | 'Discount'
  | 'Festival'
  | 'Seasonal'
  | 'Clearance Sale'
  | 'New Arrival'
  | 'Brand Awareness'
  | 'Local Awareness'
  | 'Lead Generation'
  | 'WhatsApp Promotion'
  | 'Store Visit'
  | 'Customer Testimonial'
  | 'Referral'
  | 'Event'
  | 'Anniversary'
  | 'Weekend Sale'
  | 'Flash Sale';

export type ContentType =
  | 'Instagram Post'
  | 'Carousel'
  | 'Reel Script'
  | 'Story'
  | 'WhatsApp Status'
  | 'WhatsApp Broadcast'
  | 'Facebook Post'
  | 'Google Business Post'
  | 'YouTube Short'
  | 'Blog'
  | 'Promotional Poster';

export type AssetStatus = 'Idea' | 'Draft' | 'Ready' | 'Approved' | 'Published';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPercent?: number;
  features: string[];
  brands: string[];
  imageUrl?: string;
  inStock: boolean;
  featured: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  benefits: string[];
  imageUrl?: string;
}

export interface Audience {
  primaryCustomer: string;
  ageRange: string;
  gender: string;
  location: string;
  incomeSegment: string;
  interests: string[];
  problems: string[];
  buyingMotivations: string[];
}

export interface BrandKit {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  brandTone: 'premium' | 'local' | 'energetic' | 'friendly' | 'professional';
  tagline: string;
  brandDescription: string;
  visualStyle: string;
  contactInfo: {
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    website?: string;
  };
}

export interface BusinessInfo {
  businessName: string;
  category: string;
  subCategory: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  googleMapsUrl?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface MarketingGoals {
  mainObjective: string;
  monthlyBudget: number;
  platforms: string[];
  currentOffers: string[];
  previousCampaigns: string[];
  competitors: string[];
  importantDates: string[];
  preferredLanguage: Language;
}

export interface SuccessfulContentItem {
  id: string;
  theme: string;
  channel: string;
  reason: string;
  metric: string;
}

export interface FailedContentItem {
  id: string;
  theme: string;
  channel: string;
  reason: string;
  learning: string;
}

export interface AIMemory {
  successfulContent: SuccessfulContentItem[];
  failedContent: FailedContentItem[];
  customerInsights: string[];
  campaignHistory: string[];
  brandPreferences: string[];
}

export interface Client {
  id: string;
  businessInfo: BusinessInfo;
  products: Product[];
  services: Service[];
  audience: Audience;
  brandKit: BrandKit;
  marketingGoals: MarketingGoals;
  memory: AIMemory;
  deliverablesTarget: {
    contentPerMonth: number;
    creativesPerMonth: number;
    campaignsPerMonth: number;
  };
  deliverablesDone: {
    contentThisMonth: number;
    creativesThisMonth: number;
    campaignsThisMonth: number;
    publishedThisMonth: number;
  };
  status: 'On Track' | 'Needs Attention' | 'Action Required';
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  clientId: string;
  campaignId?: string;
  title: string;
  platform: 'Instagram' | 'WhatsApp' | 'Facebook' | 'Google Business' | 'YouTube';
  contentType: ContentType;
  headline: string;
  primaryCopy: string;
  caption: string;
  cta: string;
  hashtags: string[];
  visualDirection: string;
  imagePrompt?: string;
  videoConcept?: {
    hook: string;
    scenes: { time: string; visual: string; audio: string }[];
    callToAction: string;
  };
  status: AssetStatus;
  tone: Tone;
  language: Language;
  createdAt: string;
}

export interface CreativeDimension {
  id: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  platform: 'Instagram' | 'Facebook' | 'WhatsApp' | 'Print';
}

export interface CreativeAsset {
  id: string;
  clientId: string;
  campaignId?: string;
  title: string;
  creativeType: string;
  dimension: CreativeDimension;
  headline: string;
  subheadline: string;
  offerBadge?: string;
  priceTag?: string;
  originalPrice?: string;
  ctaText: string;
  layoutTemplate: 'festive_burst' | 'minimal_product' | 'bold_urgency' | 'lifestyle_story' | 'review_quote';
  bgGradient: string;
  textColor: string;
  accentColor: string;
  productImage?: string;
  clientLogo?: string;
  footerPhone: string;
  footerAddress: string;
  status: AssetStatus;
  createdAt: string;
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  campaignType: CampaignType;
  objective: string;
  targetAudience: string;
  coreMessage: string;
  offer: string;
  duration: string;
  platforms: string[];
  cta: string;
  status: AssetStatus;
  progressPercent: number;
  contentPiecesCount: number;
  creativesCount: number;
  createdAt: string;
  // Bundled outputs
  contentAssets?: ContentItem[];
  creativeAssets?: CreativeAsset[];
}

export interface CalendarEvent {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  title: string;
  festivalName?: string;
  category: 'Festival' | 'National Day' | 'Seasonal Peak' | 'Weekend Sale' | 'Weekly Campaign';
  campaignId?: string;
  status: AssetStatus;
  platforms: string[];
  recommendedIdea: string;
}

export interface Offer {
  id: string;
  clientId: string;
  title: string;
  type: 'Buy One Get One' | 'Flat Discount' | 'Exchange Offer' | 'EMI Offer' | 'Bundle Offer' | 'Limited Time Offer' | 'Weekend Offer' | 'Festival Offer';
  productId?: string;
  productName?: string;
  originalPrice?: number;
  offerPrice?: number;
  discountBadge: string;
  urgencyMechanism: string;
  bundleDescription?: string;
  headline: string;
  cta: string;
  crossSellIdeas: string[];
  marginHealth: 'High' | 'Medium' | 'Volume Driver';
  status: 'Active' | 'Draft' | 'Expired';
  createdAt: string;
}

export interface CompetitorInsight {
  id: string;
  clientId: string;
  competitorName: string;
  category: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  googleProfile?: string;
  positioning: string;
  contentThemes: string[];
  offersObserved: string[];
  creativeStyle: string;
  postingFrequency: string;
  vulnerabilitiesAndGaps: string[];
  opportunityForClient: string;
}

export interface AnalyticsData {
  clientId: string;
  overview: {
    totalReach: number;
    reachGrowthPercent: number;
    totalImpressions: number;
    engagementRate: number;
    leadsGenerated: number;
    whatsappInquiries: number;
    clicks: number;
    conversions: number;
    estimatedRevenue: number;
    estimatedROI: number;
  };
  platformBreakdown: {
    platform: string;
    sharePercent: number;
    inquiries: number;
    topPost: string;
  }[];
  monthlyTrend: {
    month: string;
    reach: number;
    leads: number;
    inquiries: number;
  }[];
  campaignPerformance: {
    campaignName: string;
    status: string;
    spend: number;
    inquiries: number;
    costPerInquiry: number;
    conversionRate: number;
  }[];
}

export interface ProactiveRecommendation {
  id: string;
  title: string;
  why: string;
  targetAudience: string;
  objective: string;
  offer: string;
  platform: string;
  creativeDirection: string;
  cta: string;
  expectedPurpose: string;
  campaignType: CampaignType;
}

export interface StrategistOutput {
  businessAnalysis: {
    positioning: string;
    targetAudienceMatrix: string;
    customerPainPoints: string[];
    buyingTriggers: string[];
    competitiveOpportunities: string[];
    localMarketingOpportunities: string[];
  };
  marketingStrategy: {
    monthlyTheme: string;
    weeklyThemes: { week: number; focus: string; rationale: string }[];
    contentPillars: { pillar: string; percent: number; description: string }[];
    promotionalStrategy: string;
    awarenessStrategy: string;
    conversionStrategy: string;
    retentionStrategy: string;
  };
  recommendations: ProactiveRecommendation[];
}

export interface AIProviderConfig {
  provider: 'local' | 'gemini' | 'openai' | 'claude';
  apiKey?: string;
  modelName?: string;
}
