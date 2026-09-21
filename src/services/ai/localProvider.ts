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

export class LocalMarketingAIProvider implements AIProvider {
  id = 'local';
  name = 'Built-in Local Business Intelligence Engine';

  async generateStrategy(client: Client): Promise<StrategistOutput> {
    const city = client.businessInfo.city || 'Local Market';
    const name = client.businessInfo.businessName || 'Business';
    const category = client.businessInfo.category || 'Retail';
    const featuredProduct = client.products[0]?.name || 'Flagship offerings';

    return {
      businessAnalysis: {
        positioning: `${name} holds prime competitive positioning in ${city} as an authentic, high-trust destination for ${category}, outperforming generic competitors through personalized service, local presence, and relationship trust.`,
        targetAudienceMatrix: `${client.audience.primaryCustomer || 'Local customers'} in ${city} and surrounding areas with income ${client.audience.incomeSegment || 'standard'}. Primary trigger is local trust, reliable post-purchase support, and transparent pricing.`,
        customerPainPoints: client.audience.problems.length > 0 ? client.audience.problems : [
          `Frustration with impersonal delivery delays and unverified sellers`,
          `Lack of transparent, direct local customer assistance`,
          `Desire for immediate local support and warranty confidence`,
        ],
        buyingTriggers: client.audience.buyingMotivations.length > 0 ? client.audience.buyingMotivations : [
          `Word-of-mouth reputation and verifiable physical location trust`,
          `Exclusive local privileges and immediate fulfillment`,
          `Personalized guidance from knowledgeable local staff`,
        ],
        competitiveOpportunities: [
          `National and online marketplaces lack immediate physical presence; ${name} can dominate on prompt local response.`,
          `Competitor marketing is often generic; ${name} should lead with authentic showcases and customer transformations.`,
          `Leverage hyper-targeted WhatsApp status broadcasts to nurture repeat footfalls and referrals.`,
        ],
        localMarketingOpportunities: [
          `Seasonal and festive promotions tailored to ${city} calendar events.`,
          `Localized language hooks blending regional terminology with commercial clarity.`,
          `Exclusive local VIP broadcasts for loyal neighborhood patrons.`,
        ],
      },
      marketingStrategy: {
        monthlyTheme: `Dominating Local Trust & Urgent Seasonal Upgrades in ${city}`,
        weeklyThemes: [
          {
            week: 1,
            focus: `Flagship Focus: ${featuredProduct}`,
            rationale: `Anchor the month with the highest-demand hero item to capture active shoppers.`,
          },
          {
            week: 2,
            focus: `Social Proof & Customer Transformation Case Studies`,
            rationale: `Show real local customers sharing their experience to alleviate purchase hesitation.`,
          },
          {
            week: 3,
            focus: `Exclusive Limited-Time Privilege Blitz`,
            rationale: `Lower friction for local buyers with time-sensitive bonus incentives.`,
          },
          {
            week: 4,
            focus: `Urgency Climax & Month-End VIP WhatsApp Broadcasts`,
            rationale: `Capture fence-sitters before promotion expires.`,
          },
        ],
        contentPillars: [
          { pillar: 'Authority & Education', percent: 30, description: 'How-to guides, common buyer mistakes, and product comparison demos.' },
          { pillar: 'Offers & Commercial Urgency', percent: 35, description: 'Exclusive discounts, bundle bonuses, and special financing schemes.' },
          { pillar: 'Social Proof & Behind-the-scenes', percent: 20, description: 'Customer testimonials, store highlights, and team pride.' },
          { pillar: 'Community & Culture', percent: 15, description: `Local ${city} festive greetings and community updates.` },
        ],
        promotionalStrategy: `Combine high-impact Instagram posts and Reels for discovery with 1-to-1 WhatsApp Broadcasts to warm contacts, backed by localized Google Business Profile posts.`,
        awarenessStrategy: `Store highlights, local landmark call-outs, and relatable regional hooks.`,
        conversionStrategy: `Frictionless WhatsApp chat triggers, transparent pricing, and clear limited-time call to actions.`,
        retentionStrategy: `Periodic check-ins, VIP pre-booking privileges, and exclusive referral incentives.`,
      },
      recommendations: await this.getDailyRecommendations(client),
    };
  }

  async getDailyRecommendations(client: Client): Promise<ProactiveRecommendation[]> {
    const city = client.businessInfo.city || 'Local Area';
    const name = client.businessInfo.businessName || 'Our Business';
    const topProd = client.products[0]?.name || client.businessInfo.category || 'Featured Offer';
    const activeOffer = client.marketingGoals.currentOffers[0] || 'Exclusive Privilege Offer';

    return [
      {
        id: `rec-${Date.now()}-1`,
        title: `Weekend Showcase: ${topProd}`,
        why: `High weekend footfall intent + active demand in ${city}.`,
        targetAudience: client.audience.primaryCustomer || 'Local neighborhood shoppers',
        objective: 'Drive immediate walk-ins and weekend WhatsApp inquiries',
        offer: activeOffer,
        platform: 'Instagram Post & WhatsApp Broadcast',
        creativeDirection: `Bold visual showing ${topProd} with high-contrast offer badge and ${name} contact details.`,
        cta: `WhatsApp ${client.businessInfo.whatsapp || 'Us'} / Visit Store`,
        expectedPurpose: 'Generates high-intent local customer inquiries within 48 hours.',
        campaignType: 'Weekend Sale',
      },
      {
        id: `rec-${Date.now()}-2`,
        title: `Authentic Spotlight: "What Every ${city} Buyer Should Know"`,
        why: `Address common customer questions and build undeniable local authority.`,
        targetAudience: client.audience.primaryCustomer || 'Research-stage shoppers',
        objective: 'Educational trust-building with organic shareability',
        offer: 'Complimentary Consultation / Service Check',
        platform: 'Instagram Reel & YouTube Short',
        creativeDirection: `Team member showcasing ${topProd} quality in natural light with clear practical tips.`,
        cta: 'Save this post & WhatsApp us for details',
        expectedPurpose: 'Builds long-term brand recall and doubles social profile visits.',
        campaignType: 'Brand Awareness',
      },
      {
        id: `rec-${Date.now()}-3`,
        title: `VIP WhatsApp Secret Offer for Valued Patrons`,
        why: `Past patrons have a significantly higher conversion rate when offered an exclusive privilege.`,
        targetAudience: 'Loyal customer database and WhatsApp contacts',
        objective: 'Re-engage past buyers with an exclusive loyalty incentive',
        offer: activeOffer,
        platform: 'WhatsApp Broadcast',
        creativeDirection: 'Clean personalized text with bulleted highlights and a 1-tap reply keyword.',
        cta: 'Reply "VIP" to claim your voucher',
        expectedPurpose: 'Zero-ad-spend revenue bump from existing customer relationship list.',
        campaignType: 'WhatsApp Promotion',
      },
    ];
  }

  async generateCampaign(client: Client, campaignType: CampaignType, focusTopic?: string): Promise<Campaign> {
    const city = client.businessInfo.city || 'City';
    const name = client.businessInfo.businessName || 'Business';
    const product = client.products[0];
    const productName = focusTopic || product?.name || client.businessInfo.category || 'Special Promotion';
    const language = client.marketingGoals.preferredLanguage || 'Hinglish';
    const offer = client.marketingGoals.currentOffers[0] || `Special ${campaignType} In-Store Offer`;
    const address = client.businessInfo.address || `${city} Main Market`;
    const whatsapp = client.businessInfo.whatsapp || client.businessInfo.phone || 'Contact us';

    const isHinglish = language === 'Hinglish';
    const isHindi = language === 'Hindi';

    const headlineText = isHinglish
      ? `${city} Ke Liye Special: ${productName} Par Behtareen Offer!`
      : isHindi
      ? `${city} में पाएं सबसे बड़ा ऑफर - ${productName} पर विशेष छूट`
      : `Special Announcement in ${city}: Exclusive ${productName} Promotion`;

    const coreMsg = isHinglish
      ? `${city} ke sabse bharosemand showroom ${name} se payein 100% asli quality aur special ${campaignType} offers!`
      : `Get guaranteed genuine quality, express doorstep delivery, and dedicated customer care from ${name}.`;

    const campaignId = `camp-${Date.now()}`;

    const igPost: ContentItem = {
      id: `cnt-${Date.now()}-1`,
      clientId: client.id,
      campaignId,
      title: `${campaignType} - Instagram Feed & Carousel`,
      platform: 'Instagram',
      contentType: 'Instagram Post',
      headline: headlineText,
      primaryCopy: `${name} brings you the most awaited ${campaignType} in ${city}!\n\n✨ Featured: ${productName}\n🔥 Limited Period Offer: ${offer}\n📍 Available at: ${address}\n\nVisit our store or tap the link in bio to book yours on WhatsApp before stocks end.`,
      caption: `Don't miss out on ${city}'s favorite ${categoryKeyword(client.businessInfo.category)} deals! 📍 Visit ${name} or WhatsApp us at ${whatsapp}.`,
      cta: 'WhatsApp Us Now / Link in Bio',
      hashtags: [`#${cleanTag(city)}`, `#${cleanTag(name)}`, `#${cleanTag(client.businessInfo.category)}`, '#LocalBusiness', '#ShopLocal'],
      visualDirection: `Eye-catching agency graphic with ${client.brandKit.primaryColor || '#111111'} accents, bold cutout of ${productName}, offer badge, and store trust guarantee.`,
      imagePrompt: `Professional commercial photograph of ${productName} against a modern aesthetic backdrop with clean studio lighting.`,
      status: 'Ready',
      tone: isHinglish ? 'hinglish' : 'professional',
      language,
      createdAt: new Date().toISOString(),
    };

    const waMsg: ContentItem = {
      id: `cnt-${Date.now()}-2`,
      clientId: client.id,
      campaignId,
      title: `${campaignType} - WhatsApp Broadcast`,
      platform: 'WhatsApp',
      contentType: 'WhatsApp Broadcast',
      headline: `📢 Special Announcement from ${name}, ${city}!`,
      primaryCopy: `Namaste 🙏,\n\nWe have launched our exclusive *${campaignType}* for our valued customers!\n\n⭐ *${productName}*\n🔹 Offer: *${offer}*\n🔹 Guaranteed Authenticity & Quality\n\n📍 *Store Address:* ${address}\n📞 *Call / WhatsApp:* ${whatsapp}\n\n_Reply "OFFER" to reserve yours today!_`,
      caption: 'Reply OFFER on WhatsApp to secure exclusive pricing.',
      cta: 'Reply "OFFER" on WhatsApp',
      hashtags: [],
      visualDirection: 'Single clean WhatsApp flyer image optimized for quick mobile loading.',
      status: 'Ready',
      tone: isHinglish ? 'hinglish' : 'friendly',
      language,
      createdAt: new Date().toISOString(),
    };

    const reelItem: ContentItem = {
      id: `cnt-${Date.now()}-3`,
      clientId: client.id,
      campaignId,
      title: `${campaignType} - 30s Reel Script`,
      platform: 'Instagram',
      contentType: 'Reel Script',
      headline: `Viral Reel: Why Everyone in ${city} is Talking About This!`,
      primaryCopy: `Script optimized for local discovery and high replay rates.`,
      caption: `Watch till the end to see the offer! 💥 Available exclusively at ${name}, ${city}. #ShopLocal`,
      cta: 'DM us "DEAL" for instant WhatsApp details',
      hashtags: [`#${cleanTag(city)}Reels`, `#${cleanTag(name)}`, '#LocalShopping'],
      visualDirection: 'Dynamic fast cuts inside store highlighting product build quality, unboxing, and happy customer interaction.',
      videoConcept: {
        hook: `Hook (0-3s): "If you live in ${city}, check this out before you make your next purchase!"`,
        scenes: [
          { time: '0:00 - 0:04', visual: `Presenter smiling on camera inside ${name} location`, audio: `"Attention ${city}! Here is an exclusive update for you."` },
          { time: '0:05 - 0:14', visual: `Camera zooms in on ${productName}, showing feature demonstration`, audio: `"Look at the premium quality here. Genuine local care and complete peace of mind."` },
          { time: '0:15 - 0:23', visual: `Display of special offer counter and ${offer} banner`, audio: `"Plus, this week only, get exclusive privileges on every booking."` },
          { time: '0:24 - 0:30', visual: `Store exterior banner and WhatsApp number graphics`, audio: `"Drop by ${address} or comment DEAL below for WhatsApp details!"` },
        ],
        callToAction: `Store: ${address} | WhatsApp: ${whatsapp}`,
      },
      status: 'Ready',
      tone: isHinglish ? 'hinglish' : 'energetic',
      language,
      createdAt: new Date().toISOString(),
    };

    const gbpPost: ContentItem = {
      id: `cnt-${Date.now()}-4`,
      clientId: client.id,
      campaignId,
      title: `${campaignType} - Google Business Profile Update`,
      platform: 'Google Business',
      contentType: 'Google Business Post',
      headline: `Special Offer: ${productName} Now Available at ${name}, ${city}`,
      primaryCopy: `${name} is proud to announce our limited-time ${campaignType}. Drop by our location at ${address} to experience live demonstrations and consult with our experts. Special ${offer} available on all purchases this week.`,
      caption: `Open daily at ${address}.`,
      cta: 'Call Now / Get Directions',
      hashtags: [],
      visualDirection: 'Crisp storefront or high-res product photo with Call Now button overlay.',
      status: 'Ready',
      tone: 'professional',
      language,
      createdAt: new Date().toISOString(),
    };

    return {
      id: campaignId,
      clientId: client.id,
      name: `${productName} ${campaignType}`,
      campaignType,
      objective: `Generate store footfalls, phone calls, and WhatsApp chat leads in ${city}`,
      targetAudience: client.audience.primaryCustomer || 'Local customers',
      coreMessage: coreMsg,
      offer,
      duration: '7 Days',
      platforms: ['Instagram', 'WhatsApp', 'Facebook', 'Google Business'],
      cta: `WhatsApp ${whatsapp} or Visit Store`,
      status: 'Ready',
      progressPercent: 0,
      contentPiecesCount: 4,
      creativesCount: 0,
      createdAt: new Date().toISOString(),
      contentAssets: [igPost, waMsg, reelItem, gbpPost],
    };
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
    const city = client.businessInfo.city || 'City';
    const name = client.businessInfo.businessName || 'Business';
    const focus = options.campaignFocus || client.products[0]?.name || client.businessInfo.category || 'Special Offer';
    const address = client.businessInfo.address || `${city} Main Market`;
    const whatsapp = client.businessInfo.whatsapp || client.businessInfo.phone || 'Contact us';

    const isHinglish = options.language === 'Hinglish' || options.tone === 'hinglish';
    const isHindi = options.language === 'Hindi' || options.tone === 'hindi';

    let headline = '';
    let primaryCopy = '';
    let caption = '';

    if (isHinglish) {
      headline = `${city} Ke Liye Special Offer: ${focus} Ab Asaan Sharton Par!`;
      primaryCopy = `Kyun karein compromise jab ${name} hai aapke shehar ${city} mein!\n\nAbhi aaiye aur le jaiye ${focus} behtareen discounts aur special offers ke saath.\n\n✅ 100% Asli Quality Guarantee\n✅ Fast Local Service\n✅ Quick WhatsApp Support\n\nStore Address: ${address}`;
      caption = `Aapka apna bharosemand destination - ${name}! 📍 ${address}. WhatsApp par enquiry ke liye contact karein.`;
    } else if (isHindi) {
      headline = `${city} का सबसे भरोसेमंद शोरूम: ${focus} पर विशेष महा-बचत ऑफर`;
      primaryCopy = `${name} में आपका स्वागत है!\n\nअब ${focus} पर पाएं बेहतरीन डिस्काउंट और आसान सुविधा।\n\n- 100% ओरिजिनल उत्पाद\n- तुरंत डिलीवरी\n- विश्वसनीय सर्विस\n\nस्थान: ${address}`;
      caption = `आज ही पधारें हमारे शोरूम पर। संपर्क करें: ${whatsapp}`;
    } else {
      headline = `Upgrade with Confidence: Experience ${focus} at ${name}, ${city}`;
      primaryCopy = `Looking for the best deal on ${focus} in ${city}?\n\nAt ${name}, we pair manufacturer-backed authenticity with dedicated local customer care and transparent pricing.\n\n📍 Visit us at ${address}\n📞 Call or WhatsApp: ${whatsapp}`;
      caption = `Transform your experience with authentic products and personal care. Visit ${name} today!`;
    }

    if (options.tone === 'sales') {
      primaryCopy = `🔥 HURRY - LIMITED STOCK ALERT! 🔥\n\n${primaryCopy}\n\n⏰ Offer valid while stocks last this week only!`;
    } else if (options.tone === 'shorter') {
      primaryCopy = `${headline}\n\n📍 ${name}, ${address}\n📞 WhatsApp: ${whatsapp}`;
    } else if (options.tone === 'gen-z') {
      primaryCopy = `Big upgrade energy only ✨ Stop sleeping on ${focus}! Drop by ${name} in ${city} and level up your game. Hit us up on WhatsApp rn! 📲`;
    } else if (options.tone === 'emotional') {
      primaryCopy = `Ghar wahi jo parivaar ki har khushi ka dhyan rakhe. ${name} is proud to bring comfort, smiles, and celebrations to homes across ${city}. Explore ${focus} with love. ❤️`;
    }

    return {
      id: `cnt-${Date.now()}`,
      clientId: client.id,
      title: `${options.contentType} - ${focus}`,
      platform: options.platform,
      contentType: options.contentType,
      headline,
      primaryCopy,
      caption,
      cta: `WhatsApp ${whatsapp} / Visit Store`,
      hashtags: [`#${cleanTag(city)}`, `#${cleanTag(name)}`, '#LocalShopping', '#BestDeals'],
      visualDirection: `Clean, modern layout using ${client.brandKit.primaryColor || '#111111'} and ${client.brandKit.accentColor || '#666666'}, showcasing ${focus} with clear typography and local contact badge.`,
      imagePrompt: `Clean commercial advertisement graphic for ${focus}, modern aesthetic, warm lighting, high detail, studio finish.`,
      status: 'Draft',
      tone: options.tone,
      language: options.language,
      createdAt: new Date().toISOString(),
    };
  }

  async generateOffers(client: Client, productId?: string, offerType?: string): Promise<Offer> {
    const prod = client.products.find((p) => p.id === productId) || client.products[0];
    const city = client.businessInfo.city || 'City';
    const name = client.businessInfo.businessName || 'Business';
    const prodName = prod?.name || client.businessInfo.category || 'Store Special';
    const price = prod?.price || 5000;
    const type = (offerType as Offer['type']) || 'Exchange Offer';
    const whatsapp = client.businessInfo.whatsapp || client.businessInfo.phone || 'Contact us';

    const discountAmount = Math.round(price * 0.15);
    const offerPrice = price - discountAmount;

    return {
      id: `off-${Date.now()}`,
      clientId: client.id,
      title: `${prodName} ${type} - ${city}`,
      type,
      productId: prod?.id,
      productName: prodName,
      originalPrice: price,
      offerPrice,
      discountBadge: `Flat ₹${discountAmount.toLocaleString()} Savings + Express Service`,
      urgencyMechanism: `Limited to the first 20 bookings this week at our ${city} store.`,
      headline: `Special Privilege Offer: ${prodName} at ${name}!`,
      cta: `WhatsApp Par Book Karein: ${whatsapp}`,
      crossSellIdeas: [
        `Complementary accessory pack at special discount`,
        `Extended service package with annual checkup`,
      ],
      marginHealth: 'Medium',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
  }

  async repurposeContent(client: Client, original: ContentItem, targetType: ContentType): Promise<ContentItem> {
    const isScript = targetType === 'Reel Script' || targetType === 'YouTube Short';
    const isWhatsApp = targetType === 'WhatsApp Broadcast' || targetType === 'WhatsApp Status';
    const city = client.businessInfo.city || 'City';
    const name = client.businessInfo.businessName || 'Business';
    const address = client.businessInfo.address || `${city} Main Market`;
    const whatsapp = client.businessInfo.whatsapp || client.businessInfo.phone || 'Contact us';

    let newCopy = original.primaryCopy;
    let newHeadline = original.headline;

    if (isScript) {
      newHeadline = `Video Reel: ${original.headline}`;
      newCopy = `HOOK (0-3s): "Did you know this about shopping in ${city}?"\n\nCORE DEMO: ${original.primaryCopy.slice(0, 160)}...\n\nCALL TO ACTION: Visit ${name} or click the link in bio to chat on WhatsApp!`;
    } else if (isWhatsApp) {
      newHeadline = `Exclusive WhatsApp Alert: ${original.headline}`;
      newCopy = `Namaste 🙏\n\n${original.headline}\n\n${original.primaryCopy}\n\n📍 ${address}\n📞 ${whatsapp}\n\n_Reply to this message for instant assistance!_`;
    }

    return {
      id: `cnt-${Date.now()}`,
      clientId: client.id,
      campaignId: original.campaignId,
      title: `${targetType} (Repurposed from ${original.contentType})`,
      platform: isWhatsApp ? 'WhatsApp' : isScript ? 'Instagram' : 'Facebook',
      contentType: targetType,
      headline: newHeadline,
      primaryCopy: newCopy,
      caption: original.caption,
      cta: original.cta,
      hashtags: original.hashtags,
      visualDirection: `Adapted for ${targetType} format while preserving brand standards.`,
      status: 'Draft',
      tone: original.tone,
      language: original.language,
      createdAt: new Date().toISOString(),
    };
  }

  async analyzeBrandConsistency(client: Client, copyText: string): Promise<BrandConsistencyResult> {
    const brandTone = client.brandKit.brandTone || 'professional';
    const phone = client.businessInfo.whatsapp || client.businessInfo.phone || '';
    const city = client.businessInfo.city || '';

    const strengths: string[] = [];
    const violations: string[] = [];
    let score = 85;

    if (city && copyText.toLowerCase().includes(city.toLowerCase())) {
      strengths.push(`Local geographic anchor: Clearly references ${city} for neighborhood credibility.`);
      score += 5;
    } else if (city) {
      violations.push(`Missing local anchor: Consider mentioning ${city} or local landmarks.`);
      score -= 5;
    }

    if (phone && (copyText.includes(phone) || copyText.toLowerCase().includes('whatsapp'))) {
      strengths.push('High-converting frictionless CTA: Direct WhatsApp contact channel is explicitly stated.');
      score += 5;
    } else {
      violations.push('No direct WhatsApp or contact callout found in the copy.');
      score -= 10;
    }

    if (copyText.toLowerCase().includes('take your business to the next level') || copyText.toLowerCase().includes('revolutionize')) {
      violations.push('Generic AI marketing cliché detected. Replace with tangible product benefits or pricing.');
      score -= 15;
    } else {
      strengths.push('Avoids corporate cliché jargon; stays grounded in commercial reality.');
    }

    return {
      score: Math.min(100, Math.max(30, score)),
      strengths,
      violations,
      suggestion: violations.length > 0
        ? `Improve score by injecting ${city || 'local'} context and your WhatsApp booking channel (${phone || 'contact info'}).`
        : `Outstanding brand consistency! Meets all ${brandTone} tone and contact requirements.`,
    };
  }
}

function cleanTag(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

function categoryKeyword(cat: string = ''): string {
  if (cat.toLowerCase().includes('electron')) return 'electronics';
  if (cat.toLowerCase().includes('fashion')) return 'apparel';
  if (cat.toLowerCase().includes('fit')) return 'fitness';
  if (cat.toLowerCase().includes('food') || cat.toLowerCase().includes('cafe')) return 'dining';
  if (cat.toLowerCase().includes('furnitur')) return 'furniture';
  return 'shopping';
}

export const localAIProvider = new LocalMarketingAIProvider();
