import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Plus,
  Download,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Repeat,
  ArrowRight,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { Campaign, Client, CampaignType, ContentItem, AssetStatus } from '../../types';
import { aiManager } from '../../services/ai/aiManager';
import { campaignStore } from '../../services/storage/campaignStore';
import { downloadCampaignPack } from '../../services/storage/creativeExporter';

interface CampaignStudioProps {
  client: Client;
  campaigns: Campaign[];
  onOpenCreativeStudio: (campaign: Campaign) => void;
  onOpenRepurpose: (item: ContentItem) => void;
}

export const CampaignStudio: React.FC<CampaignStudioProps> = ({
  client,
  campaigns,
  onOpenCreativeStudio,
  onOpenRepurpose,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [activeAssetFilter, setActiveAssetFilter] = useState<'All' | 'Instagram' | 'WhatsApp' | 'Facebook' | 'Google Business'>('All');
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<CampaignType>('Weekend Sale');
  const [campaignFocus, setCampaignFocus] = useState(client?.products?.[0]?.name || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const currentCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const campaignTypesList: CampaignType[] = [
    'Weekend Sale',
    'Festival',
    'Product Promotion',
    'Discount',
    'Seasonal',
    'Flash Sale',
    'Product Launch',
    'Clearance Sale',
    'New Arrival',
    'Brand Awareness',
    'Local Awareness',
    'Lead Generation',
    'WhatsApp Promotion',
    'Store Visit',
    'Customer Testimonial',
    'Referral',
    'Event',
    'Anniversary',
  ];

  const handleCreateFullCampaign = async () => {
    setGenerating(true);
    try {
      const provider = aiManager.getProvider();
      const newCamp = await provider.generateCampaign(client, selectedType, campaignFocus || (client?.products?.[0]?.name || 'Special Offer'));
      campaignStore.addCampaign(newCamp);
      setSelectedCampaignId(newCamp.id);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (campaignId: string, assetId: string, status: AssetStatus) => {
    campaignStore.updateAssetStatus(campaignId, assetId, status);
  };

  const handleDownloadPack = async () => {
    if (!currentCampaign) return;
    setIsExporting(true);
    try {
      await downloadCampaignPack(currentCampaign, client);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredAssets = currentCampaign?.contentAssets?.filter((a) => {
    if (activeAssetFilter === 'All') return true;
    return a.platform === activeAssetFilter;
  }) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: One Click Campaign Machine */}
      <div className="bg-[#F7F7F7] p-5 rounded-xl border border-[#E5E5E5]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center text-white">
                <Megaphone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#111111] tracking-tight">
                Campaign Machine: One Idea → Entire Campaign
              </h2>
            </div>
            <p className="text-xs text-[#666666] mt-1">
              Generates Strategy + Instagram Post + Carousel + Reel Script + WhatsApp Broadcast + WhatsApp Status + Facebook Post + GBP Post + Visual Directions.
            </p>
          </div>

          {/* Quick Trigger Form */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CampaignType)}
              className="bg-white border border-[#E5E5E5] text-[#111111] text-xs rounded-xl px-3 py-2 font-medium"
            >
              {campaignTypesList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Focus Product / Theme"
              value={campaignFocus}
              onChange={(e) => setCampaignFocus(e.target.value)}
              className="bg-white border border-[#E5E5E5] text-[#111111] text-xs rounded-xl px-3 py-2 w-44 placeholder-[#999999]"
            />

            <button
              onClick={handleCreateFullCampaign}
              disabled={generating}
              className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Synthesizing Full Campaign...' : 'Generate Full Campaign'}</span>
            </button>
          </div>
        </div>
      </div>

      {campaigns.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <Megaphone className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">No campaigns yet</h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            Create your first multi-channel campaign with AI-generated strategy, social posts, WhatsApp broadcasts, and creative copy.
          </p>
          <button
            onClick={handleCreateFullCampaign}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{generating ? 'Generating Campaign...' : 'Create Campaign'}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Campaign Selector Bar */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-2">
              {campaigns.map((camp) => {
                const isSelected = camp.id === currentCampaign?.id;
                return (
                  <button
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'bg-white text-[#666666] hover:text-[#111111] border border-[#E5E5E5]'
                    }`}
                  >
                    <span>{camp.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#F7F7F7] text-[#666666]'
                    }`}>
                      {camp.campaignType}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentCampaign && (
              <button
                onClick={handleDownloadPack}
                disabled={isExporting}
                className="py-2 px-3.5 rounded-xl bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1.5 border border-[#E5E5E5] transition-colors shrink-0"
                title="Download full campaign pack with strategy, captions, and scripts as ZIP"
              >
                <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>Download Campaign Pack</span>
              </button>
            )}
          </div>

          {currentCampaign && (
            <div className="space-y-6">
              {/* Strategy Card */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 text-xs text-[#666666]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <span>Campaign Strategy: {currentCampaign.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                      {currentCampaign.status}
                    </span>
                  </h3>
                  <div className="text-[11px] text-[#999999]">
                    Created: {new Date(currentCampaign.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Objective
                    </span>
                    <p className="text-[#111111] font-medium">{currentCampaign.objective}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Target Audience
                    </span>
                    <p className="text-[#111111] font-medium">{currentCampaign.targetAudience}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Offer Mechanics
                    </span>
                    <p className="text-[#666666] font-medium">{currentCampaign.offer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Primary CTA
                    </span>
                    <p className="text-[#111111] font-bold">{currentCampaign.cta}</p>
                  </div>
                </div>
              </div>

              {/* Platform Filter */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(['All', 'Instagram', 'WhatsApp', 'Facebook', 'Google Business'] as const).map(
                    (platform) => (
                      <button
                        key={platform}
                        onClick={() => setActiveAssetFilter(platform)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                          activeAssetFilter === platform
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#F7F7F7] text-[#999999] hover:text-[#111111] border border-[#E5E5E5]'
                        }`}
                      >
                        {platform}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => onOpenCreativeStudio(currentCampaign)}
                  className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Design Visual Creatives for this Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Generated Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAssets.map((asset) => {
                  const isCopied = copiedId === asset.id;
                  return (
                    <div
                      key={asset.id}
                      className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col justify-between text-xs space-y-3"
                    >
                      <div>
                        {/* Asset Header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {asset.platform === 'Instagram' ? (
                              <InstagramIcon className="w-4 h-4 text-[#111111]" />
                            ) : asset.platform === 'WhatsApp' ? (
                              <MessageSquare className="w-4 h-4 text-[#111111]" />
                            ) : asset.platform === 'Facebook' ? (
                              <FacebookIcon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Share2 className="w-4 h-4 text-[#111111]" />
                            )}
                            <span className="font-bold text-[#111111] text-xs">{asset.title}</span>
                          </div>

                          {/* Approval Status Selector */}
                          <select
                            value={asset.status}
                            onChange={(e) =>
                              handleStatusChange(
                                currentCampaign.id,
                                asset.id,
                                e.target.value as AssetStatus
                              )
                            }
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-white focus:outline-none cursor-pointer text-[#111111] border-[#E5E5E5]"
                          >
                            <option value="Idea">Idea</option>
                            <option value="Draft">Draft</option>
                            <option value="Ready">Ready</option>
                            <option value="Approved">Approved</option>
                            <option value="Published">Published</option>
                          </select>
                        </div>

                        {/* Headline */}
                        <h4 className="font-bold text-[#111111] mb-2 leading-snug">
                          {asset.headline}
                        </h4>

                        {/* Reel Storyboard or Copy Box */}
                        {asset.videoConcept ? (
                          <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] space-y-2 mb-3">
                            <div className="text-[#111111] font-semibold text-[11px]">
                              {asset.videoConcept.hook}
                            </div>
                            <div className="space-y-1 text-[#666666]">
                              {asset.videoConcept.scenes.map((sc, sidx) => (
                                <div key={sidx} className="border-l-2 border-[#D4D4D4] pl-2 py-0.5">
                                  <span className="font-mono text-[10px] text-[#999999]">{sc.time}:</span>{' '}
                                  <span className="text-[#111111]">{sc.audio}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-[11px] text-[#111111] font-semibold pt-1">
                              CTA: {asset.videoConcept.callToAction}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] text-[#111111] whitespace-pre-line leading-relaxed mb-3 max-h-48 overflow-y-auto">
                            {asset.primaryCopy}
                          </div>
                        )}

                        {/* Visual Direction */}
                        <div className="bg-[#F7F7F7] p-2.5 rounded-lg border border-[#E5E5E5] text-[11px] text-[#666666] mb-2">
                          <span className="text-[#111111] font-semibold">Visual Direction: </span>
                          {asset.visualDirection}
                        </div>

                        {/* Hashtags */}
                        {asset.hashtags.length > 0 && (
                          <div className="text-[11px] text-[#666666] font-mono">
                            {asset.hashtags.join(' ')}
                          </div>
                        )}
                      </div>

                      {/* Asset Footer Action Buttons */}
                      <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(asset.id, asset.primaryCopy || asset.headline)}
                            className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] flex items-center gap-1 transition-colors border border-[#E5E5E5]"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-[#111111]" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => onOpenRepurpose(asset)}
                            className="py-1 px-2.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] flex items-center gap-1 transition-colors border border-[#E5E5E5]"
                            title="Repurpose into other formats"
                          >
                            <Repeat className="w-3 h-3 text-[#111111]" />
                            <span>Repurpose</span>
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              currentCampaign.id,
                              asset.id,
                              asset.status === 'Approved' ? 'Published' : 'Approved'
                            )
                          }
                          className={`py-1 px-3 rounded-lg font-semibold transition-colors ${
                            asset.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#111111] hover:bg-[#222222] text-white shadow-sm'
                          }`}
                        >
                          {asset.status === 'Approved' ? 'Mark Published' : 'Approve Asset'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
