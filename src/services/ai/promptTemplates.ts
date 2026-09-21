export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  campaign_generation_prompt: {
    id: 'campaign_generation_prompt',
    name: 'Full Multi-Channel Campaign Machine',
    description: 'Generates comprehensive campaign strategy, Instagram post, Story, Reel script, WhatsApp message, Facebook post, and creative specs.',
    template: `You are the Lead Marketing Strategist for {{business_name}} located in {{city}}, {{state}}.
Context:
- Category: {{category}} ({{sub_category}})
- Brand Tone: {{brand_tone}} | Tagline: "{{tagline}}"
- Primary Customer: {{primary_customer}} ({{income_segment}})
- Customer Pain Points: {{pain_points}}
- Preferred Language: {{language}}
- Active Offers: {{active_offers}}
- What worked previously: {{successful_themes}}
- What failed previously (AVOID): {{failed_learnings}}

Task: Generate a high-converting {{campaign_type}} campaign for "{{campaign_focus}}".
Do NOT use generic corporate fluff like "Take your business to the next level".
Root every headline and hook in real product utility, local relevance, and specific pricing/EMI/offers.
Return structured JSON.`,
  },
  content_generation_prompt: {
    id: 'content_generation_prompt',
    name: 'Multi-Platform Content Writer',
    description: 'Creates copy with platform-specific character limits, tailored hooks, hashtags, and CTA.',
    template: `You are a Direct-Response Copywriter for {{business_name}} in {{city}}.
Write a {{content_type}} for the following objective: {{objective}}.
Tone: {{tone}} | Language: {{language}}.
Product/Offer: {{product_offer}}.
Local nuances: Involve {{city}} local context, weather, or cultural habits naturally without forced jargon.
Provide: Headline, Primary Copy, Caption, CTA, Hashtags, and Visual Direction.`,
  },
  local_campaign_prompt: {
    id: 'local_campaign_prompt',
    name: 'Hyper-Local Marketing Engine',
    description: 'Crafts city and neighborhood specific messaging based on climate, culture, and regional buying habits.',
    template: `You are a Hyper-Local Retail Marketing Specialist.
Client: {{business_name}} in {{city}}, {{state}}.
Local context: Generate a campaign addressing specific challenges or moments in {{city}} (e.g. desert heat in Bikaner, wedding seasons in Jaipur, cafe culture in Delhi).
Tone: {{language}} with authentic regional resonance.
Provide: Localized Hook, Why it resonates locally, Offer construct, and WhatsApp CTA.`,
  },
  festival_campaign_prompt: {
    id: 'festival_campaign_prompt',
    name: 'Festive & Occasion Campaign Generator',
    description: 'Crafts auspicious festive campaigns with cultural elegance and retail incentive.',
    template: `Festival: {{festival_name}}.
Client: {{business_name}} ({{category}}).
Create an auspicious festive promotion that respects cultural traditions while driving early festive bookings and showroom footfalls.
Include: Festive Headline, Auspicious angle, Shubh discount/gift, WhatsApp booking trigger.`,
  },
  reel_script_prompt: {
    id: 'reel_script_prompt',
    name: 'Viral Local Reel Scriptwriter',
    description: 'Generates 3-second hook, visual storyboard, audio cues, and clear CTA.',
    template: `Write a high-retention 30-second Instagram Reel script for {{business_name}} in {{city}}.
Objective: {{objective}}.
Structure:
- Hook (0-3s): Visually arresting scene + verbal pattern interrupt
- Problem/Contrast (4-12s): The relatable frustration
- Solution/Showcase (13-22s): Clear product demonstration in showroom
- Call to Action (23-30s): Clear physical address + WhatsApp DM keyword`,
  },
  whatsapp_campaign_prompt: {
    id: 'whatsapp_campaign_prompt',
    name: 'WhatsApp Broadcast & Status Copywriter',
    description: 'Formats high-open-rate broadcasts with emojis, bold highlights, and 1-word reply triggers.',
    template: `Draft a high-conversion WhatsApp Broadcast message for {{business_name}} customers.
Message should feel personal, concise, and valuable.
Include:
- Friendly greeting
- Urgency reason (weekend, price hike alert, limited stock)
- Bulleted key highlights with emojis
- Clear address & 1-word reply trigger ("Reply 'OFFER' to lock this price")`,
  },
  offer_generation_prompt: {
    id: 'offer_generation_prompt',
    name: 'Retail Offer Formula Engine',
    description: 'Calculates high-converting margin-healthy retail offers, urgency triggers, and bundle mechanics.',
    template: `Product: {{product_name}} (Price: ₹{{price}}, Margin Health: {{margin_health}}).
Client: {{business_name}} in {{city}}.
Generate a compelling retail offer.
Types to consider: BOGO, Flat %, Exchange Bonus, No Cost EMI, or Festive Bundle.
Ensure: Clear financial value, psychological urgency trigger, and cross-sell opportunity.`,
  },
};
