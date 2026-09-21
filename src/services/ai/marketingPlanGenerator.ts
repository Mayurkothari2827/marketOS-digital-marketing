import {
  BusinessInput,
  MarketingPlan,
  CampaignIdea,
  CampaignCreative,
  MarketingStrategy,
} from '../../types/marketingPlan';
import { aiManager } from './aiManager';

// Helper to sanitize and format location
function parseLocation(loc: string): { city: string; state: string } {
  const parts = loc.split(',').map((p) => p.trim());
  return {
    city: parts[0] || 'Local',
    state: parts[1] || '',
  };
}

// Generate smart assumptions when fields are not explicitly provided
function inferAssumptions(input: BusinessInput) {
  const { city } = parseLocation(input.location);
  const catLower = input.category.toLowerCase();
  const prodLower = input.products.toLowerCase();

  let audience = input.targetCustomers?.trim();
  const assumptions: string[] = [];

  if (!audience) {
    if (catLower.includes('electronics') || catLower.includes('appliance') || prodLower.includes('ac') || prodLower.includes('tv')) {
      audience = `Homeowners, families, and middle-to-high-income residents in ${city} seeking reliable appliances and authorized warranty.`;
      assumptions.push(`Determined target audience as ${city} homeowners and families seeking genuine brand warranty.`);
    } else if (catLower.includes('fashion') || catLower.includes('clothing') || catLower.includes('lehenga') || catLower.includes('boutique')) {
      audience = `Style-conscious women, festive shoppers, and wedding families in ${city} looking for quality fabrics and designer fits.`;
      assumptions.push(`Determined target audience as festive shoppers, bridal parties, and local fashion enthusiasts.`);
    } else if (catLower.includes('fitness') || catLower.includes('gym') || prodLower.includes('workout')) {
      audience = `Young professionals, students, and health-conscious adults (age 18–45) in ${city} looking for strength training and wellness.`;
      assumptions.push(`Determined target audience as young adults and fitness-focused residents.`);
    } else if (catLower.includes('food') || catLower.includes('cafe') || catLower.includes('restaurant') || catLower.includes('bakery')) {
      audience = `Local youth, couples, college students, and families in ${city} seeking quality dining and weekend leisure.`;
      assumptions.push(`Determined target audience as local food lovers, youth, and families.`);
    } else {
      audience = `Local residents and value-conscious shoppers in ${city} who prioritize trusted, reliable service.`;
      assumptions.push(`Assumed core customer base as local ${city} neighborhood shoppers.`);
    }
  }

  let usp = input.usp?.trim();
  if (!usp) {
    usp = `Verified quality, direct showroom experience, personalized customer service, and doorstep support in ${city}.`;
    assumptions.push(`Inferred key USP as local trust, hands-on assistance, and immediate showroom availability.`);
  }

  let offer = input.offers?.trim();
  if (!offer) {
    offer = `Special seasonal privileges and exclusive bundle benefits available for ${city} shoppers this week.`;
    assumptions.push(`Formulated flexible commercial hook around seasonal privileges.`);
  }

  return { audience, usp, offer, assumptions };
}

// Background gradient presets for creative concepts
const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
  'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
  'linear-gradient(135deg, #881337 0%, #4c0519 60%, #1c1917 100%)',
  'linear-gradient(135deg, #064e3b 0%, #022c22 65%, #09090b 100%)',
  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
];

export async function generateMarketingPlan(input: BusinessInput): Promise<MarketingPlan> {
  const { city } = parseLocation(input.location);
  const { audience, usp, offer, assumptions } = inferAssumptions(input);

  // Parse product list or main item
  const productList = input.products
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const heroProduct = productList[0] || input.products.slice(0, 40);
  const secondaryProduct = productList[1] || 'premium range';

  const defaultProductImage = input.productImages?.[0] || '';

  // 1. Positioning & Strategy
  const strategy: MarketingStrategy = {
    positioning: `${input.businessName} is positioned as ${city}'s premier destination for ${input.category}. By pairing authentic local presence with ${usp}, the business bridges the gap between digital discovery and high-trust local fulfillment.`,
    targetAudience: audience,
    marketingAngle: `Combine hyper-local pride with irresistible commercial urgency ("Why wait for online delivery when your trusted ${city} showroom gives you immediate demo, warranty, and special incentives today?").`,
    contentDirection: `Direct-response video hooks (Reels), punchy value-driven Instagram carousel cards, and direct WhatsApp VIP broadcasts for instant conversational bookings.`,
    recommendedTone: `Warm, authoritative, conversational, and respectful with natural local ${city} nuances.`,
    assumptionsMade: assumptions,
  };

  // 2. Generate 6 distinct, high-impact campaign concepts
  const campaignBlueprints = [
    {
      name: `01 — ${heroProduct} Showcase & Upgrade`,
      objective: `Drive direct footfalls and WhatsApp inquiries for ${heroProduct}.`,
      coreIdea: `Highlight the flagship product with clear value transparency, instant availability, and local post-purchase support.`,
      targetAudience: audience,
      hook: `Why compromise with unverified online sellers? Get the authentic ${heroProduct} right here in ${city}!`,
      offer: offer,
      keyMessage: `${input.businessName} delivers unmatched quality, authentic guarantees, and dedicated local customer care.`,
      cta: `WhatsApp ${input.phone || 'us'} for today's price & demonstration`,
      platforms: ['Instagram', 'WhatsApp', 'Facebook'],
      conceptType: 'product' as const,
      priceTag: 'Exclusive Deal',
    },
    {
      name: `02 — ${city} Seasonal Festival Dhamaka`,
      objective: `Capture high festive buying intent with limited-time celebration bonuses.`,
      coreIdea: `Tie festive celebrations into celebratory shopping incentives and family purchase moments.`,
      targetAudience: `Families, festive shoppers, and gift-buyers in ${city}.`,
      hook: `Is Tyohar, Apne Ghar Layein Nayi Khushiyan with ${input.businessName}!`,
      offer: `Special Festive Bonus & Exclusive Gift Bundles on all ${input.category}`,
      keyMessage: `Celebrate the season with trusted quality and guaranteed best prices in ${city}.`,
      cta: `Visit our showroom or reserve via WhatsApp`,
      platforms: ['Instagram', 'WhatsApp', 'Facebook'],
      conceptType: 'offer' as const,
      priceTag: 'Festive Special',
    },
    {
      name: `03 — Smart Exchange & Trade-In Blitz`,
      objective: `Lower purchase hesitation by providing trade-in value on older models.`,
      coreIdea: `Remove the friction of old products by offering hassle-free doorstep valuation and instant trade-in credits.`,
      targetAudience: `Existing product owners looking to upgrade without paying full retail.`,
      hook: `Purana Badlo, Naya Le Jao! Best trade-in value guaranteed across ${city}.`,
      offer: `Flat Exchange Bonus + Flexible No-Cost EMI Available`,
      keyMessage: `Upgrade to top-tier ${heroProduct} today with zero hidden charges.`,
      cta: `Send photo on WhatsApp for instant exchange quote`,
      platforms: ['WhatsApp', 'Instagram', 'Facebook'],
      conceptType: 'offer' as const,
      priceTag: 'Trade-in Bonus',
    },
    {
      name: `04 — 48-Hour Weekend Flash Sale`,
      objective: `Create instant weekend urgency and rapid showroom footfalls.`,
      coreIdea: `High-urgency countdown promotion for weekend buyers with limited stock reservations.`,
      targetAudience: `Deal hunters, weekend shoppers, and active buyers in ${city}.`,
      hook: `Sirf Is Weekend: Limited Stock Flash Privileges at ${input.businessName}!`,
      offer: `Exclusive Weekend Markdown on ${heroProduct} & ${secondaryProduct}`,
      keyMessage: `First 25 customers this Saturday & Sunday unlock priority savings.`,
      cta: `Reserve your unit via WhatsApp before stock clears`,
      platforms: ['Instagram', 'WhatsApp'],
      conceptType: 'lifestyle' as const,
      priceTag: 'Weekend Only',
    },
    {
      name: `05 — The Local Trust & Transparency Showcase`,
      objective: `Differentiate from faceless e-commerce through local credibility.`,
      coreIdea: `Spotlight real customer satisfaction, immediate physical showroom support, and 100% genuine guarantees.`,
      targetAudience: `Skeptical buyers worried about fake reviews or difficult return policies.`,
      hook: `Local Trust You Can Rely On: Why 1,000+ ${city} families trust ${input.businessName}.`,
      offer: `100% Genuine Guarantee + Complimentary Setup & Assistance`,
      keyMessage: `Real people, real showroom, real peace of mind.`,
      cta: `Visit our ${city} showroom today`,
      platforms: ['Instagram', 'Facebook', 'WhatsApp'],
      conceptType: 'lifestyle' as const,
      priceTag: '100% Genuine',
    },
    {
      name: `06 — VIP WhatsApp Community Broadcast`,
      objective: `Generate direct conversational sales from warm inquiries.`,
      coreIdea: `Personalized 1-to-1 conversational messaging that feels like an insider tip from the shop owner.`,
      targetAudience: `Previous customers, repeat shoppers, and saved inquiry contacts.`,
      hook: `Special Insider Preview: New ${heroProduct} arrivals now live in ${city}.`,
      offer: `Secret VIP Subscriber Pricing for 24 Hours Only`,
      keyMessage: `Private access reserved exclusively for our valued community.`,
      cta: `Reply "INTERESTED" to claim your VIP coupon`,
      platforms: ['WhatsApp'],
      conceptType: 'product' as const,
      priceTag: 'VIP Price',
    },
  ];

  const campaigns: CampaignIdea[] = campaignBlueprints.map((bp, index) => {
    const campaignId = `camp-${Date.now()}-${index + 1}`;

    // Generate comprehensive multi-channel copy
    const headline = `${bp.name.split('—')[1]?.trim() || bp.name}`;
    const primaryCopy = `${city} ke sabhi customers ke liye special announcement!\n\n${input.businessName} par ab uplabdh hai premium ${heroProduct} with ${bp.offer}.\n\n✓ ${usp}\n✓ 100% Genuine & Official Warranty\n✓ Direct showroom assistance in ${city}\n\n${bp.keyMessage}\n\nStock limited hai — Der mat kijiye!`;

    const instagramCaption = `✨ ${headline} ✨\n\nUpgrade your lifestyle with ${heroProduct} exclusively at ${input.businessName}, ${city}!\n\n${bp.hook}\n\n🔥 Offer Highlights:\n• ${bp.offer}\n• ${usp}\n• Immediate delivery & expert setup in ${city}\n\n📍 Visit our showroom or click the link in bio to chat with us on WhatsApp.\n\n${bp.cta}!`;

    const hashtags = [
      `#${city.replace(/\s+/g, '')}`,
      `#${input.businessName.replace(/[^a-zA-Z0-9]/g, '')}`,
      `#${input.category.split(/[\s&]+/)[0]}Store`,
      `#ShopLocal${city.replace(/\s+/g, '')}`,
      '#BestDeals',
      '#SpecialOffer',
      '#LocalBusiness',
    ];

    const whatsappMessage = `*${input.businessName} — Special Announcement (${city})*\n\nNamaste! 🙏\n\n${bp.hook}\n\n🏷️ *Special Offer:* ${bp.offer}\n📦 *Featured:* ${heroProduct}\n⭐ *Why Choose Us:* ${usp}\n\n📍 *Showroom Location:* ${input.location}\n\n👉 *Reply to this message* to reserve your deal or ask any questions!\n\n_${bp.cta}_`;

    const facebookPost = `Attention ${city}! Looking for top quality ${input.category}? ${input.businessName} has you covered with authentic products, personalized service, and unmatched value.\n\n${bp.hook}\n\nSpecial Offer: ${bp.offer}\n\nVisit us today or send us a message to speak directly with our team!`;

    const storySequence = [
      {
        frame: 1,
        text: `Something big is here for ${city}... 👀`,
        visual: `Clean zoom on ${heroProduct} with brand badge.`,
      },
      {
        frame: 2,
        text: `${bp.offer}! Only at ${input.businessName}`,
        visual: `Bold offer card with high-contrast typography and authentic product photo.`,
      },
      {
        frame: 3,
        text: `Tap below to WhatsApp us instantly! 📲`,
        visual: `Direct WhatsApp message trigger sticker with location tag (${city}).`,
      },
    ];

    const reelConcept = {
      hook: `Are you still buying ${input.category} without local warranty in ${city}? Watch this before you make your next purchase!`,
      scenes: [
        {
          time: '0:00 - 0:05',
          visual: `Dynamic close-up hook showing ${heroProduct} in the showroom.`,
          audio: `Don't make this common mistake when buying ${input.category} in ${city}!`,
        },
        {
          time: '0:05 - 0:15',
          visual: `Showcasing key product features, build quality, and verified authenticity.`,
          audio: `At ${input.businessName}, you get 100% genuine stock, authorized warranty, and zero delivery wait.`,
        },
        {
          time: '0:15 - 0:25',
          visual: `Highlighting the commercial offer badge (${bp.offer}).`,
          audio: `Plus, this week only, get ${bp.offer} right at our showroom!`,
        },
        {
          time: '0:25 - 0:30',
          visual: `Showroom entrance, contact details, and CTA banner.`,
          audio: `DM or WhatsApp us right now before this offer wraps up!`,
        },
      ],
      callToAction: `WhatsApp ${input.phone || 'us'} today for live product demo!`,
    };

    // 3. Generate 3 Creative Concept Variations per Campaign
    const creatives: CampaignCreative[] = [
      {
        id: `cr-${campaignId}-product`,
        conceptType: 'product',
        label: 'Concept 1: Product-Focused',
        headline: `${heroProduct}`,
        subheadline: `${bp.offer} — Available Now in ${city}`,
        offerBadge: '100% Genuine',
        priceTag: bp.priceTag,
        ctaText: 'Visit Store / WhatsApp',
        bgGradient: GRADIENT_PRESETS[index % GRADIENT_PRESETS.length],
        accentColor: '#f59e0b',
        productImage: defaultProductImage,
        showLogo: true,
        showContactBar: true,
      },
      {
        id: `cr-${campaignId}-offer`,
        conceptType: 'offer',
        label: 'Concept 2: Offer & Value-Focused',
        headline: `${bp.offer}`,
        subheadline: `Special Privilege on ${heroProduct} at ${input.businessName}`,
        offerBadge: 'Limited Time Deal',
        priceTag: 'Save Big Today',
        ctaText: 'Claim Your Offer',
        bgGradient: GRADIENT_PRESETS[(index + 1) % GRADIENT_PRESETS.length],
        accentColor: '#10b981',
        productImage: defaultProductImage,
        showLogo: true,
        showContactBar: true,
      },
      {
        id: `cr-${campaignId}-lifestyle`,
        conceptType: 'lifestyle',
        label: 'Concept 3: Local Pride & Urgency',
        headline: `${city}'s Trusted Choice`,
        subheadline: `Upgrade your home with ${input.businessName}. ${usp}`,
        offerBadge: `${city} Special`,
        priceTag: 'Best Price Assured',
        ctaText: 'Book Demonstration',
        bgGradient: GRADIENT_PRESETS[(index + 2) % GRADIENT_PRESETS.length],
        accentColor: '#3b82f6',
        productImage: defaultProductImage,
        showLogo: true,
        showContactBar: true,
      },
    ];

    return {
      id: campaignId,
      name: bp.name,
      objective: bp.objective,
      coreIdea: bp.coreIdea,
      targetAudience: bp.targetAudience,
      hook: bp.hook,
      offer: bp.offer,
      keyMessage: bp.keyMessage,
      cta: bp.cta,
      platforms: bp.platforms,
      content: {
        headline,
        primaryCopy,
        instagramCaption,
        hashtags,
        whatsappMessage,
        facebookPost,
        storySequence,
        reelConcept,
      },
      creatives,
    };
  });

  return {
    id: `plan-${Date.now()}`,
    businessInput: input,
    strategy,
    campaigns,
    createdAt: new Date().toISOString(),
  };
}

export function refineCampaignCreative(
  creative: CampaignCreative,
  modifier: 'premium' | 'local' | 'sales' | 'minimal' | 'hindi' | 'hinglish',
  business: BusinessInput
): CampaignCreative {
  const { city } = parseLocation(business.location);
  const updated = { ...creative, id: `cr-${Date.now()}` };

  switch (modifier) {
    case 'premium':
      updated.headline = `Exquisite Collection · ${business.businessName}`;
      updated.subheadline = `Engineered for distinction. Experience authentic luxury and dedicated showroom care in ${city}.`;
      updated.offerBadge = 'Signature Series';
      updated.ctaText = 'Inquire for Privileges';
      updated.bgGradient = 'linear-gradient(135deg, #09090b 0%, #171717 60%, #262626 100%)';
      updated.accentColor = '#e2b340';
      break;

    case 'local':
      updated.headline = `${city} Ka Apna Vishwas: ${business.businessName}`;
      updated.subheadline = `Seedha showroom se, bina kisi delivery wait ke. Asli warranty aur behtareen daam!`;
      updated.offerBadge = `${city} Special`;
      updated.ctaText = 'Showroom Visit Karein';
      updated.bgGradient = 'linear-gradient(135deg, #881337 0%, #4c0519 60%, #09090b 100%)';
      updated.accentColor = '#f59e0b';
      break;

    case 'sales':
      updated.headline = `Hurry! Limited Stock Clearance`;
      updated.subheadline = `Heavy price drop on all units. First 20 customers unlock additional store credits.`;
      updated.offerBadge = 'Flat Savings';
      updated.ctaText = 'Grab Deal Now';
      updated.bgGradient = 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 60%, #18181b 100%)';
      updated.accentColor = '#fbbf24';
      break;

    case 'minimal':
      updated.headline = `${business.businessName}`;
      updated.subheadline = `Pure quality. Transparent pricing. Available in ${city}.`;
      updated.offerBadge = 'Authentic';
      updated.ctaText = 'Explore Details';
      updated.bgGradient = 'linear-gradient(135deg, #18181b 0%, #09090b 100%)';
      updated.accentColor = '#94a3b8';
      break;

    case 'hindi':
      updated.headline = `शुद्ध गुणवत्ता और बेहतरीन सेवा`;
      updated.subheadline = `${city} में आपका अपना भरोसेमंद शोरूम: ${business.businessName}`;
      updated.offerBadge = 'विशेष ऑफर';
      updated.ctaText = 'व्हाट्सएप करें';
      updated.bgGradient = 'linear-gradient(135deg, #701a75 0%, #4a044e 60%, #0f172a 100%)';
      updated.accentColor = '#facc15';
      break;

    case 'hinglish':
      updated.headline = `Sabse Bada Dhamaka Offer!`;
      updated.subheadline = `${city} walo, purana badlo aur naya le jao best showroom discounts ke sath.`;
      updated.offerBadge = 'Super Deal';
      updated.ctaText = 'Book Now On WhatsApp';
      updated.bgGradient = 'linear-gradient(135deg, #0f172a 0%, #0369a1 60%, #0284c7 100%)';
      updated.accentColor = '#38bdf8';
      break;
  }

  return updated;
}
