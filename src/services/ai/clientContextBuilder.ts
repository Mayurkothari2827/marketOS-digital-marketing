import { Client } from '../../types';

export interface ClientContext {
  business: {
    name: string;
    category: string;
    subCategory: string;
    city: string;
    state: string;
    description: string;
    whatsapp: string;
    phone: string;
    address: string;
  };
  brand: {
    tone: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    visualStyle: string;
  };
  audience: {
    primaryCustomer: string;
    ageRange: string;
    location: string;
    incomeSegment: string;
    painPoints: string[];
    buyingMotivations: string[];
  };
  featuredProducts: {
    name: string;
    category: string;
    price: number;
    discountPercent?: number;
    keyFeatures: string[];
  }[];
  activeOffers: string[];
  topSuccessfulCampaigns: {
    theme: string;
    channel: string;
    reason: string;
    metric: string;
  }[];
  learningsFromFailedContent: string[];
  preferredLanguage: string;
}

export function buildClientContext(client: Client): ClientContext {
  return {
    business: {
      name: client.businessInfo.businessName,
      category: client.businessInfo.category,
      subCategory: client.businessInfo.subCategory,
      city: client.businessInfo.city,
      state: client.businessInfo.state,
      description: client.businessInfo.description,
      whatsapp: client.businessInfo.whatsapp,
      phone: client.businessInfo.phone,
      address: client.businessInfo.address,
    },
    brand: {
      tone: client.brandKit.brandTone,
      tagline: client.brandKit.tagline,
      primaryColor: client.brandKit.primaryColor,
      secondaryColor: client.brandKit.secondaryColor,
      accentColor: client.brandKit.accentColor,
      visualStyle: client.brandKit.visualStyle,
    },
    audience: {
      primaryCustomer: client.audience.primaryCustomer,
      ageRange: client.audience.ageRange,
      location: client.audience.location,
      incomeSegment: client.audience.incomeSegment,
      painPoints: client.audience.problems,
      buyingMotivations: client.audience.buyingMotivations,
    },
    featuredProducts: client.products.slice(0, 4).map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      discountPercent: p.discountPercent,
      keyFeatures: p.features.slice(0, 3),
    })),
    activeOffers: client.marketingGoals.currentOffers,
    topSuccessfulCampaigns: client.memory.successfulContent.slice(0, 3).map((s) => ({
      theme: s.theme,
      channel: s.channel,
      reason: s.reason,
      metric: s.metric,
    })),
    learningsFromFailedContent: client.memory.failedContent.slice(0, 2).map((f) => f.learning),
    preferredLanguage: client.marketingGoals.preferredLanguage,
  };
}
