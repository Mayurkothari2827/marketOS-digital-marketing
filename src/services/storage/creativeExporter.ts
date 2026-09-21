import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import { Campaign, Client } from '../../types';
import { MarketingPlan, CampaignIdea } from '../../types/marketingPlan';

export async function downloadElementAsImage(
  elementId: string,
  filename: string = 'creative.png',
  format: 'png' | 'jpeg' = 'png'
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2, // 2x high-resolution retina export
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function downloadMarketingPlanPack(
  plan: MarketingPlan,
  selectedCampaign?: CampaignIdea,
  creativeElementIds: string[] = []
) {
  const zip = new JSZip();
  const business = plan.businessInput;
  const campaign = selectedCampaign || plan.campaigns[0];

  // 1. Executive Strategy Brief
  const strategyDoc = `# Marketing Plan: ${business.businessName}
**Category:** ${business.category}
**Location:** ${business.location}
**Date Generated:** ${new Date(plan.createdAt).toLocaleDateString()}

---

## 1. AI Strategic Analysis
- **Positioning:** ${plan.strategy.positioning}
- **Target Audience:** ${plan.strategy.targetAudience}
- **Core Marketing Angle:** ${plan.strategy.marketingAngle}
- **Content Direction:** ${plan.strategy.contentDirection}
- **Recommended Tone:** ${plan.strategy.recommendedTone}

${plan.strategy.assumptionsMade?.length ? `\n### Smart Marketing Assumptions\n` + plan.strategy.assumptionsMade.map((a) => `- ${a}`).join('\n') : ''}

---

## 2. Campaign Concepts Overview
${plan.campaigns
  .map(
    (c, i) => `### ${c.name}
- **Objective:** ${c.objective}
- **Core Idea:** ${c.coreIdea}
- **Hook:** ${c.hook}
- **Offer:** ${c.offer}
- **CTA:** ${c.cta}
- **Channels:** ${c.platforms.join(', ')}
`
  )
  .join('\n')}
`;
  zip.file('01_Executive_Strategy_Brief.md', strategyDoc);

  // 2. Selected Campaign Copy Pack
  if (campaign) {
    const copyDoc = `=== CAMPAIGN COPY PACK: ${campaign.name} ===
Business: ${business.businessName} (${business.location})
Objective: ${campaign.objective}

==================================================
1. INSTAGRAM CAPTION & HASHTAGS
==================================================
${campaign.content.instagramCaption}

Hashtags:
${campaign.content.hashtags.join(' ')}


==================================================
2. WHATSAPP VIP PROMOTIONAL BROADCAST
==================================================
${campaign.content.whatsappMessage}


==================================================
3. FACEBOOK POST COPY
==================================================
${campaign.content.facebookPost}


==================================================
4. 30-SECOND REEL SCRIPT
==================================================
HOOK:
${campaign.content.reelConcept.hook}

SCENES:
${campaign.content.reelConcept.scenes
  .map((s) => `[${s.time}]\nVisual: ${s.visual}\nAudio: ${s.audio}\n`)
  .join('\n')}

CALL TO ACTION:
${campaign.content.reelConcept.callToAction}


==================================================
5. 3-FRAME INSTAGRAM STORY SEQUENCE
==================================================
${campaign.content.storySequence
  .map((frame) => `Frame ${frame.frame}:\nText: ${frame.text}\nVisual: ${frame.visual}\n`)
  .join('\n')}
`;
    zip.file(`02_${campaign.name.replace(/[^a-zA-Z0-9]/g, '_')}_Copy_Pack.txt`, copyDoc);
  }

  // 3. Render and embed actual creative image files
  if (creativeElementIds.length > 0) {
    const creativesFolder = zip.folder('Creatives');
    for (let i = 0; i < creativeElementIds.length; i++) {
      const elId = creativeElementIds[i];
      const el = document.getElementById(elId);
      if (el) {
        try {
          const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true });
          const imgBase64 = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
          creativesFolder?.file(`Creative_Concept_${i + 1}.png`, imgBase64, { base64: true });
        } catch (err) {
          console.warn(`Could not render creative ${elId}`, err);
        }
      }
    }
  }

  // 4. Raw JSON Structured Machine Data
  zip.file('marketos_plan_data.json', JSON.stringify(plan, null, 2));

  // Generate & Download ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${business.businessName.replace(/\s+/g, '_')}_MarketOS_Campaign_Pack.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

// Preserve existing legacy export function for backward compatibility
export async function downloadCampaignPack(campaign: Campaign, client: Client) {
  const zip = new JSZip();

  const strategyContent = `# Campaign Strategy: ${campaign.name}
**Client:** ${client.businessInfo.businessName} (${client.businessInfo.city}, ${client.businessInfo.state})
**Campaign Type:** ${campaign.campaignType}
**Objective:** ${campaign.objective}
**Target Audience:** ${campaign.targetAudience}
**Core Message:** ${campaign.coreMessage}
**Offer:** ${campaign.offer}
**Duration:** ${campaign.duration}
**Platforms:** ${campaign.platforms.join(', ')}
**Call to Action:** ${campaign.cta}
**Generated Date:** ${new Date(campaign.createdAt).toLocaleDateString()}
`;
  zip.file('01_Strategy_Brief.md', strategyContent);

  const igPosts = campaign.contentAssets?.filter((a) => a.platform === 'Instagram') || [];
  let igContent = `=== INSTAGRAM CONTENT ===\n`;
  igPosts.forEach((post, i) => {
    igContent += `--- Post #${i + 1}: ${post.headline} ---\n${post.primaryCopy}\n\n`;
  });
  zip.file('02_Instagram_Posts.txt', igContent || 'No posts.');

  zip.file('campaign_data.json', JSON.stringify({ campaign, clientSummary: client.businessInfo }, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${client.businessInfo.businessName.replace(/\s+/g, '_')}_Campaign_Pack.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
