import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Repeat,
  MessageSquare,
  Share2,
  Video,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { Client, Campaign, ContentItem, ContentType, Tone, Language, AssetStatus } from '../../types';
import { aiManager } from '../../services/ai/aiManager';
import { campaignStore } from '../../services/storage/campaignStore';

interface ContentStudioProps {
  client: Client;
  campaigns: Campaign[];
  onOpenRepurpose: (item: ContentItem) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  client,
  campaigns,
  onOpenRepurpose,
}) => {
  const [platform, setPlatform] = useState<'Instagram' | 'WhatsApp' | 'Facebook' | 'Google Business' | 'YouTube'>('Instagram');
  const [contentType, setContentType] = useState<ContentType>('Instagram Post');
  const [selectedTone, setSelectedTone] = useState<Tone>('hinglish');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(client?.marketingGoals?.preferredLanguage || 'Hinglish');
  const [campaignFocus, setCampaignFocus] = useState(client?.products?.[0]?.name || '');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const contentTypes: { type: ContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'Instagram Post', label: 'Instagram Post', icon: InstagramIcon },
    { type: 'Carousel', label: 'Carousel (10 Slides)', icon: InstagramIcon },
    { type: 'Reel Script', label: '30s Reel Script', icon: Video },
    { type: 'Story', label: 'Instagram Story', icon: InstagramIcon },
    { type: 'WhatsApp Broadcast', label: 'WhatsApp Broadcast', icon: MessageSquare },
    { type: 'WhatsApp Status', label: 'WhatsApp Status', icon: MessageSquare },
    { type: 'Facebook Post', label: 'Facebook Post', icon: FacebookIcon },
    { type: 'Google Business Post', label: 'Google Business Profile', icon: Share2 },
    { type: 'YouTube Short', label: 'YouTube Short Script', icon: Video },
    { type: 'Blog', label: 'Local SEO Article', icon: FileText },
    { type: 'Promotional Poster', label: 'Showroom Poster Copy', icon: FileText },
  ];

  const toneModifiers: { tone: Tone; label: string }[] = [
    { tone: 'hinglish', label: 'Make it Hinglish' },
    { tone: 'hindi', label: 'Make it Hindi' },
    { tone: 'local', label: `Make More Local (${client?.businessInfo?.city || 'Local'})` },
    { tone: 'sales', label: 'Make Sales Focused & Urgency' },
    { tone: 'premium', label: 'Make More Premium & Elegant' },
    { tone: 'shorter', label: 'Make Shorter & Snappy' },
    { tone: 'gen-z', label: 'Make it Gen-Z' },
    { tone: 'emotional', label: 'Make it Emotional' },
    { tone: 'professional', label: 'Make it Professional' },
  ];

  const handleGenerate = async (overrideTone?: Tone) => {
    if (!client) return;
    setLoading(true);
    const toneToUse = overrideTone || selectedTone;
    try {
      const provider = aiManager.getProvider();
      const res = await provider.generateContent(client, {
        platform,
        contentType,
        tone: toneToUse,
        language: selectedLanguage,
        campaignFocus: campaignFocus || (client?.products?.[0]?.name || 'Special Promotion'),
      });
      setGeneratedContent(res);
      setSelectedTone(toneToUse);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    const text = `${generatedContent.headline}\n\n${generatedContent.primaryCopy}\n\nCTA: ${generatedContent.cta}\n\n${generatedContent.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCampaign = () => {
    if (!generatedContent) return;
    const targetCampaign = campaigns[0];
    if (targetCampaign) {
      campaignStore.addContentAsset(targetCampaign.id, {
        ...generatedContent,
        status: 'Ready',
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Content Studio: Multi-Format Copywriter
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Direct-response copy tailored to {client?.businessInfo?.businessName || 'your business'}, {client?.businessInfo?.city || ''}.
            </p>
          </div>
        </div>

        {client?.businessInfo?.businessName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#999999]">Context:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
              {client.businessInfo.businessName}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Controls: Selectors */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#111111]" />
            Content Parameters
          </h3>

          {/* Platform */}
          <div>
            <label className="block text-[#999999] font-medium mb-1.5">1. Target Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Instagram', 'WhatsApp', 'Facebook', 'Google Business', 'YouTube'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`p-2 rounded-xl text-left font-medium border transition-colors ${
                    platform === p
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'bg-white text-[#666666] border-[#E5E5E5] hover:text-[#111111]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-[#999999] font-medium mb-1.5">2. Content Format</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
            >
              {contentTypes.map((ct) => (
                <option key={ct.type} value={ct.type}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product / Offer Focus */}
          <div>
            <label className="block text-[#999999] font-medium mb-1.5">3. Product / Offer Focus</label>
            <input
              type="text"
              value={campaignFocus}
              onChange={(e) => setCampaignFocus(e.target.value)}
              placeholder="e.g. Festive Offer, Seasonal Promotion, New Arrivals"
              className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-[#999999] font-medium mb-1.5">4. Language</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Hinglish', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`p-2 rounded-lg text-center font-medium border transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'bg-white text-[#666666] border-[#E5E5E5] hover:text-[#111111]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Crafting Direct-Response Copy...' : 'Create Content'}</span>
          </button>
        </div>

        {/* Right Preview & Tone Modifiers */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tone Quick-Modifiers Bar */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#999999] block mb-2">
              AI Tone Modifiers (1-Click Rewrite)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {toneModifiers.map((tm) => (
                <button
                  key={tm.tone}
                  onClick={() => handleGenerate(tm.tone)}
                  disabled={loading}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    selectedTone === tm.tone
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'bg-white text-[#666666] border-[#E5E5E5] hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {tm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 text-xs">
            {generatedContent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#111111] tracking-wider">
                      {generatedContent.platform} • {generatedContent.contentType}
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] mt-0.5">
                      {generatedContent.headline}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="py-1 px-3 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#E5E5E5]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Copy'}</span>
                    </button>

                    <button
                      onClick={() => onOpenRepurpose(generatedContent)}
                      className="py-1 px-3 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5] text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Repurpose</span>
                    </button>
                  </div>
                </div>

                {/* Primary Copy */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#999999] mb-1">
                    Primary Body Copy
                  </label>
                  <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] leading-relaxed whitespace-pre-line text-xs font-normal">
                    {generatedContent.primaryCopy}
                  </div>
                </div>

                {/* Caption & CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]">
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Caption
                    </span>
                    <p className="text-[#666666]">{generatedContent.caption}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]">
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Call to Action (CTA)
                    </span>
                    <p className="text-[#111111] font-bold">{generatedContent.cta}</p>
                  </div>
                </div>

                {/* Visual Direction & Image Prompt */}
                <div className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1.5">
                  <div className="text-[#111111] font-bold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                    <span>Creative Visual Direction:</span>
                  </div>
                  <p className="text-[#666666]">{generatedContent.visualDirection}</p>
                  {generatedContent.imagePrompt && (
                    <div className="pt-1 text-[11px] text-[#999999]">
                      <span className="text-[#999999]">AI Image Prompt: </span>
                      <span className="font-mono text-[#666666]">{generatedContent.imagePrompt}</span>
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                {generatedContent.hashtags.length > 0 && (
                  <div className="font-mono text-[#666666] text-[11px]">
                    {generatedContent.hashtags.join(' ')}
                  </div>
                )}

                {/* Save to Campaign Pipeline */}
                <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                  <div className="text-[#999999] text-xs">
                    Tone: <span className="text-[#111111] capitalize">{generatedContent.tone}</span> | Language: <span className="text-[#111111]">{generatedContent.language}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {savedSuccess && (
                      <span className="text-emerald-700 text-xs flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Added to Campaign!
                      </span>
                    )}
                    {campaigns.length > 0 && (
                      <button
                        onClick={handleSaveToCampaign}
                        className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold transition-all shadow-sm"
                      >
                        Save to Active Campaign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-[#999999] space-y-3 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-1">
                  <PenTool className="w-6 h-6 text-[#999999]" />
                </div>
                <div className="font-semibold text-[#111111]">No content generated yet.</div>
                <p className="text-xs text-[#666666] max-w-sm mx-auto mb-2">
                  Select your target platform, format, and campaign focus, then generate tailored direct-response copy.
                </p>
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Crafting Copy...' : 'Create Content'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
