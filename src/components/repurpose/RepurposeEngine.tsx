import React, { useState } from 'react';
import {
  Repeat,
  Copy,
  Check,
  MessageSquare,
  Share2,
  Video,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { Client, ContentItem, ContentType } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface RepurposeEngineProps {
  client: Client;
  initialContent?: ContentItem | null;
}

export const RepurposeEngine: React.FC<RepurposeEngineProps> = ({
  client,
  initialContent,
}) => {
  const [sourceText, setSourceText] = useState(
    initialContent?.primaryCopy || ''
  );

  const [sourceType, setSourceType] = useState<ContentType>(
    initialContent?.contentType || 'Instagram Post'
  );

  const [targetType, setTargetType] = useState<ContentType>('Reel Script');
  const [repurposedItem, setRepurposedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const availableTargets: { type: ContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'Reel Script', label: '30s Instagram Reel Script', icon: Video },
    { type: 'WhatsApp Broadcast', label: 'VIP WhatsApp Broadcast', icon: MessageSquare },
    { type: 'WhatsApp Status', label: 'WhatsApp Status Text & Visual', icon: MessageSquare },
    { type: 'Story', label: 'Instagram Story (3 Slides)', icon: InstagramIcon },
    { type: 'Facebook Post', label: 'Facebook Discussion Post', icon: FacebookIcon },
    { type: 'Google Business Post', label: 'Google Business Search Update', icon: Share2 },
    { type: 'YouTube Short', label: 'YouTube Short Video Hook', icon: Video },
  ];

  const handleRepurpose = async (target: ContentType = targetType) => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setTargetType(target);
    try {
      const provider = aiManager.getProvider();
      const dummyOriginal: ContentItem = {
        id: 'orig-1',
        clientId: client?.id || 'client-default',
        title: 'Original Post',
        platform: 'Instagram',
        contentType: sourceType,
        headline: `${client?.businessInfo?.businessName || 'Business'} Announcement`,
        primaryCopy: sourceText,
        caption: 'Special announcement',
        cta: client?.businessInfo?.whatsapp ? `WhatsApp ${client.businessInfo.whatsapp}` : 'Contact us today',
        hashtags: client?.businessInfo?.city ? [`#${client.businessInfo.city}`] : [],
        visualDirection: 'Showroom highlight',
        status: 'Draft',
        tone: 'hinglish',
        language: client?.marketingGoals?.preferredLanguage || 'Hinglish',
        createdAt: new Date().toISOString(),
      };

      const result = await provider.repurposeContent(client, dummyOriginal, target);
      setRepurposedItem(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!repurposedItem) return;
    const text = `${repurposedItem.headline}\n\n${repurposedItem.primaryCopy}\n\nCTA: ${repurposedItem.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Repurpose Engine: 1 Content Piece → 7 Formats
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Transform any social post into video scripts, WhatsApp broadcasts, GBP updates, or status slides in 1 click.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Content Box */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-[#111111] uppercase tracking-wider block">
              1. Source Content (Paste or Select)
            </label>
            <span className="text-[#999999] text-[11px]">Format: {sourceType}</span>
          </div>

          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste any Instagram post, customer review, or ad copy here..."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-3.5 text-[#111111] placeholder-[#999999] leading-relaxed focus:outline-none focus:border-[#111111]"
          />

          <div>
            <span className="text-[#999999] font-medium block mb-2">
              Select Target Format to Generate:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {availableTargets.map((item) => {
                const Icon = item.icon;
                const isSelected = targetType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleRepurpose(item.type)}
                    disabled={loading || !sourceText.trim()}
                    className={`p-2.5 rounded-xl border text-left font-medium flex items-center gap-2 transition-all disabled:opacity-50 ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] font-bold shadow-sm'
                        : 'bg-white text-[#666666] border-[#E5E5E5] hover:text-[#111111] hover:border-[#111111]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#666666]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Repurposed Output Box */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#111111] block">
                2. Repurposed Output ({targetType})
              </span>
              <h3 className="text-sm font-bold text-[#111111] mt-0.5">
                {repurposedItem ? repurposedItem.headline : 'Ready to Transform'}
              </h3>
            </div>

            {repurposedItem && (
              <button
                onClick={handleCopy}
                className="py-1 px-3 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#E5E5E5]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center text-[#999999] text-xs flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 rounded-full border-2 border-[#111111] border-t-transparent animate-spin" />
              <span>Adapting hooks, formatting, and character limits for {targetType}...</span>
            </div>
          ) : repurposedItem ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] leading-relaxed whitespace-pre-line text-xs max-h-72 overflow-y-auto">
                {repurposedItem.primaryCopy}
              </div>

              <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
                <span className="text-[10px] font-bold text-[#111111] uppercase block">CTA:</span>
                <p className="text-[#111111] font-semibold">{repurposedItem.cta}</p>
              </div>

              <div className="text-[11px] text-[#666666]">
                Visual Direction: {repurposedItem.visualDirection}
              </div>
            </div>
          ) : (
            <div className="py-28 text-center text-[#999999] space-y-2">
              <Repeat className="w-8 h-8 text-[#999999] mx-auto" />
              <p className="text-xs text-[#666666]">
                Paste source text on the left and select any format to transform your content instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
