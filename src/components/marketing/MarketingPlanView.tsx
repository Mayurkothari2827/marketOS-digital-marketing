import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  Video,
  FileText,
  Share2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Palette,
  Eye,
  FileDown,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { MarketingPlan, CampaignIdea, CampaignCreative } from '../../types/marketingPlan';
import { PlanCreativeCanvas } from './PlanCreativeCanvas';
import { refineCampaignCreative } from '../../services/ai/marketingPlanGenerator';
import { downloadMarketingPlanPack, downloadElementAsImage } from '../../services/storage/creativeExporter';

interface MarketingPlanViewProps {
  plan: MarketingPlan;
  onNewPlan: () => void;
}

export const MarketingPlanView: React.FC<MarketingPlanViewProps> = ({
  plan,
  onNewPlan,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    plan.campaigns[0]?.id || ''
  );
  const [activeChannelTab, setActiveChannelTab] = useState<
    'instagram' | 'whatsapp' | 'reels' | 'story' | 'facebook'
  >('instagram');

  const [dimension, setDimension] = useState<'portrait' | 'square' | 'story' | 'banner'>('portrait');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportingPack, setIsExportingPack] = useState(false);

  // Creative state overrides
  const [creativeOverrides, setCreativeOverrides] = useState<Record<string, CampaignCreative>>({});

  const selectedCampaign =
    plan.campaigns.find((c) => c.id === selectedCampaignId) || plan.campaigns[0];

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyModifier = (
    originalCreative: CampaignCreative,
    modifier: 'premium' | 'local' | 'sales' | 'minimal' | 'hindi' | 'hinglish'
  ) => {
    const updated = refineCampaignCreative(originalCreative, modifier, plan.businessInput);
    setCreativeOverrides((prev) => ({
      ...prev,
      [originalCreative.id]: updated,
    }));
  };

  const handleDownloadSingleCreative = async (canvasId: string, name: string) => {
    try {
      await downloadElementAsImage(canvasId, `${name}.png`, 'png');
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportFullPack = async () => {
    if (!selectedCampaign) return;
    setIsExportingPack(true);
    try {
      // Gather canvas element IDs
      const elementIds = selectedCampaign.creatives.map((c) => `canvas-creative-${c.id}`);
      await downloadMarketingPlanPack(plan, selectedCampaign, elementIds);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPack(false);
    }
  };

  const business = plan.businessInput;

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 space-y-8 pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewPlan}
            className="p-2 rounded-xl bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5] transition-colors"
            title="Create New Marketing Plan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight">
                {business.businessName}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                Plan Ready
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              {business.category} · {business.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullPack}
            disabled={isExportingPack}
            className="py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExportingPack ? 'animate-bounce' : ''}`} />
            <span>{isExportingPack ? 'Zipping Campaign Pack...' : 'Download Campaign Pack'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AI Marketing Strategy (Concise & Punchy) */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#111111]" />
            <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              AI Marketing Strategy & Positioning
            </h2>
          </div>
          <span className="text-[11px] text-[#666666]">
            Tailored to {business.location}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#999999] tracking-wider block">
              Market Positioning
            </span>
            <p className="text-[#111111] font-medium leading-relaxed">
              {plan.strategy.positioning}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#999999] tracking-wider block">
              Core Target Audience
            </span>
            <p className="text-[#111111] font-medium leading-relaxed">
              {plan.strategy.targetAudience}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#999999] tracking-wider block">
              Strategic Angle & Tone
            </span>
            <p className="text-[#111111] font-medium leading-relaxed">
              {plan.strategy.marketingAngle}
            </p>
            <div className="pt-1 text-[11px] text-[#666666]">
              <span className="font-semibold text-[#111111]">Tone: </span>
              {plan.strategy.recommendedTone}
            </div>
          </div>
        </div>

        {plan.strategy.assumptionsMade?.length > 0 && (
          <div className="p-3 bg-white rounded-xl border border-[#E5E5E5] text-[11px] text-[#666666]">
            <span className="font-semibold text-[#111111] mr-1">Smart AI Assumptions:</span>
            {plan.strategy.assumptionsMade.join(' · ')}
          </div>
        )}
      </div>

      {/* SECTION 2: 5-10 Campaign Ideas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Campaign Ideas ({plan.campaigns.length})
            </h2>
            <p className="text-xs text-[#666666]">
              Select any campaign below to preview full direct-response copy and visual creatives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.campaigns.map((camp) => {
            const isSelected = camp.id === selectedCampaign?.id;
            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-xs space-y-3 ${
                  isSelected
                    ? 'bg-[#F7F7F7] border-[#111111] shadow-sm'
                    : 'bg-white border-[#E5E5E5] hover:border-[#111111]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#111111] text-white' : 'bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5]'
                    }`}>
                      {camp.platforms.join(' · ')}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#111111] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#111111] leading-snug mb-1">
                    {camp.name}
                  </h3>

                  <p className="text-[#666666] text-[11px] line-clamp-2 mb-2">
                    {camp.hook}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white border border-[#E5E5E5] space-y-1">
                    <div className="text-[10px] text-[#999999] uppercase font-bold">Offer / Hook</div>
                    <div className="text-[11px] text-[#111111] font-semibold line-clamp-1">{camp.offer}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
                  <span className="text-[10px] text-[#999999] truncate max-w-[50%]">CTA: {camp.cta}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCampaignId(camp.id);
                    }}
                    className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#111111]'
                    }`}
                  >
                    {isSelected ? 'Viewing Campaign' : 'Select Campaign'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Selected Campaign Deep-Dive */}
      {selectedCampaign && (
        <div className="space-y-6 pt-2">
          {/* Campaign Strategy & Header */}
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#999999] tracking-wider block mb-1">
                  Selected Campaign
                </span>
                <h3 className="text-lg font-bold text-[#111111]">
                  {selectedCampaign.name}
                </h3>
              </div>
              <div className="text-xs text-[#666666]">
                Objective: <span className="font-semibold text-[#111111]">{selectedCampaign.objective}</span>
              </div>
            </div>

            {/* Channels Copy Tab Selector */}
            <div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[#E5E5E5]">
                {[
                  { id: 'instagram', label: 'Instagram Caption & Tags', icon: InstagramIcon },
                  { id: 'whatsapp', label: 'WhatsApp VIP Broadcast', icon: MessageSquare },
                  { id: 'reels', label: '30s Reel Video Script', icon: Video },
                  { id: 'story', label: '3-Frame Storyboard', icon: Share2 },
                  { id: 'facebook', label: 'Facebook Post', icon: FacebookIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeChannelTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChannelTab(tab.id as any)}
                      className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'bg-[#F7F7F7] text-[#666666] hover:text-[#111111] border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Copy Tab Panel Content */}
              <div className="pt-4">
                {activeChannelTab === 'instagram' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">Instagram Caption & Optimized Tags</span>
                      <button
                        onClick={() =>
                          handleCopyText(
                            'ig',
                            `${selectedCampaign.content.instagramCaption}\n\n${selectedCampaign.content.hashtags.join(' ')}`
                          )
                        }
                        className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 border border-[#E5E5E5] transition-colors"
                      >
                        {copiedKey === 'ig' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'ig' ? 'Copied!' : 'Copy Caption'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#111111] leading-relaxed whitespace-pre-line font-normal">
                      {selectedCampaign.content.instagramCaption}
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#E5E5E5] text-xs font-mono text-[#666666]">
                      {selectedCampaign.content.hashtags.join(' ')}
                    </div>
                  </div>
                )}

                {activeChannelTab === 'whatsapp' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">VIP WhatsApp Broadcast Message</span>
                      <button
                        onClick={() => handleCopyText('wa', selectedCampaign.content.whatsappMessage)}
                        className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 border border-[#E5E5E5] transition-colors"
                      >
                        {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'wa' ? 'Copied!' : 'Copy WhatsApp Text'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#111111] leading-relaxed whitespace-pre-line font-mono">
                      {selectedCampaign.content.whatsappMessage}
                    </div>
                  </div>
                )}

                {activeChannelTab === 'reels' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">30-Second Reel Concept & Script</span>
                      <button
                        onClick={() =>
                          handleCopyText(
                            'reel',
                            `HOOK:\n${selectedCampaign.content.reelConcept.hook}\n\nSCENES:\n${selectedCampaign.content.reelConcept.scenes
                              .map((s) => `[${s.time}] Visual: ${s.visual} | Audio: ${s.audio}`)
                              .join('\n')}\n\nCTA: ${selectedCampaign.content.reelConcept.callToAction}`
                          )
                        }
                        className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 border border-[#E5E5E5] transition-colors"
                      >
                        {copiedKey === 'reel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'reel' ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5] text-xs">
                      <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">Attention Hook</span>
                      <p className="font-bold text-[#111111]">{selectedCampaign.content.reelConcept.hook}</p>
                    </div>

                    <div className="space-y-2">
                      {selectedCampaign.content.reelConcept.scenes.map((scene, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-xs flex flex-col sm:flex-row gap-2">
                          <span className="font-mono text-[10px] text-[#999999] font-bold shrink-0">{scene.time}</span>
                          <div className="flex-1 space-y-0.5">
                            <div className="text-[#666666] text-[11px]"><span className="font-semibold text-[#111111]">Visual:</span> {scene.visual}</div>
                            <div className="text-[#111111] font-medium"><span className="font-semibold text-[#111111]">Audio:</span> {scene.audio}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-[#111111] font-semibold pt-1">
                      Call to Action: {selectedCampaign.content.reelConcept.callToAction}
                    </div>
                  </div>
                )}

                {activeChannelTab === 'story' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">3-Frame Instagram Storyboard</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedCampaign.content.storySequence.map((frame) => (
                        <div key={frame.frame} className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-2 text-xs">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-[#111111] border border-[#E5E5E5]">
                            Frame {frame.frame}
                          </span>
                          <div className="font-bold text-[#111111]">{frame.text}</div>
                          <p className="text-[11px] text-[#666666]">{frame.visual}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChannelTab === 'facebook' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">Facebook Discussion Post</span>
                      <button
                        onClick={() => handleCopyText('fb', selectedCampaign.content.facebookPost)}
                        className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 border border-[#E5E5E5] transition-colors"
                      >
                        {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'fb' ? 'Copied!' : 'Copy Post'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#111111] leading-relaxed whitespace-pre-line font-normal">
                      {selectedCampaign.content.facebookPost}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Actual Campaign Creatives (Canvas Render Gallery) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#111111] tracking-tight">
                  Campaign Visual Creatives (Ready to Use)
                </h3>
                <p className="text-xs text-[#666666]">
                  Actual high-resolution marketing graphics rendered with your branding, products, and contact details.
                </p>
              </div>

              {/* Format / Dimension Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'portrait', label: 'IG Portrait (4:5)' },
                  { id: 'square', label: 'IG Square (1:1)' },
                  { id: 'story', label: 'Story/Reel (9:16)' },
                  { id: 'banner', label: 'Facebook Banner' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDimension(d.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      dimension === d.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F7F7F7] text-[#666666] hover:text-[#111111] border border-[#E5E5E5]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Creatives Gallery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {selectedCampaign.creatives.map((baseCreative) => {
                const creative = creativeOverrides[baseCreative.id] || baseCreative;
                const canvasElementId = `canvas-creative-${baseCreative.id}`;

                return (
                  <div
                    key={baseCreative.id}
                    className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div>
                      {/* Concept Label */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E5E5E5] mb-3">
                        <span className="text-xs font-bold text-[#111111]">{creative.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#666666] font-medium border border-[#E5E5E5]">
                          {dimension}
                        </span>
                      </div>

                      {/* Actual Canvas Preview Render */}
                      <div className="bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] overflow-hidden flex items-center justify-center p-2">
                        <PlanCreativeCanvas
                          business={business}
                          creative={creative}
                          dimension={dimension}
                          canvasId={canvasElementId}
                        />
                      </div>
                    </div>

                    {/* Creative Controls & Refinement Pills */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#999999] tracking-wider block mb-1.5">
                          1-Click Style & Tone Refinements:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { id: 'premium', label: 'More Premium' },
                            { id: 'local', label: 'More Local' },
                            { id: 'sales', label: 'Sales Urgency' },
                            { id: 'minimal', label: 'Minimal' },
                            { id: 'hindi', label: 'Hindi' },
                            { id: 'hinglish', label: 'Hinglish' },
                          ].map((mod) => (
                            <button
                              key={mod.id}
                              onClick={() => handleApplyModifier(baseCreative, mod.id as any)}
                              className="px-2 py-0.5 rounded-lg bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#111111] text-[10px] font-medium border border-[#E5E5E5] transition-colors"
                            >
                              {mod.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Download Buttons */}
                      <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
                        <button
                          onClick={() =>
                            handleDownloadSingleCreative(
                              canvasElementId,
                              `${business.businessName}_${creative.label}`
                            )
                          }
                          className="w-full py-2 px-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Creative</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
