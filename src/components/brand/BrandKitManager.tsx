import React, { useState } from 'react';
import {
  ShieldCheck,
  Palette,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  RefreshCw,
  Phone,
  MapPin,
  Settings,
} from 'lucide-react';
import { Client, BrandKit } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface BrandKitManagerProps {
  client: Client;
  onUpdateBrandKit: (updated: BrandKit) => void;
}

export const BrandKitManager: React.FC<BrandKitManagerProps> = ({
  client,
  onUpdateBrandKit,
}) => {
  const isInitiallyConfigured = Boolean(
    client?.brandKit?.primaryColor &&
    client.brandKit.primaryColor !== '#000000' &&
    client?.brandKit?.tagline
  );

  const [isConfiguring, setIsConfiguring] = useState(isInitiallyConfigured);
  const [brandKit, setBrandKit] = useState<BrandKit>(
    client?.brandKit || {
      primaryColor: '#111111',
      secondaryColor: '#666666',
      accentColor: '#f59e0b',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Inter',
      brandTone: 'friendly',
      tagline: '',
      dos: [],
      donts: [],
    }
  );

  const [sampleCopy, setSampleCopy] = useState(
    `${client?.businessInfo?.businessName || 'Our showroom'} is excited to announce special offers for all customers in ${client?.businessInfo?.city || 'the city'}. Contact us today at ${client?.businessInfo?.whatsapp || 'our hotline'}!`
  );

  const [scoreResult, setScoreResult] = useState<{
    score: number;
    strengths: string[];
    violations: string[];
    suggestion: string;
  } | null>(null);

  const [checking, setChecking] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateBrandKit(brandKit);
    setIsConfiguring(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAuditScore = async () => {
    if (!client) return;
    setChecking(true);
    try {
      const provider = aiManager.getProvider();
      const res = await provider.analyzeBrandConsistency(client, sampleCopy);
      setScoreResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Brand Kit & Automated Consistency Auditor
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Defines visual standards and scores generated content against {client?.businessInfo?.businessName || 'your business'}&apos;s identity rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          {isConfiguring ? (
            <button
              onClick={handleSave}
              className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Brand Kit</span>
            </button>
          ) : (
            <button
              onClick={() => setIsConfiguring(true)}
              className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Brand Kit</span>
            </button>
          )}
        </div>
      </div>

      {!isConfiguring ? (
        /* Unconfigured State (Requirement 10 & 20) */
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 max-w-2xl mx-auto shadow-xs">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-3">
              <Palette className="w-6 h-6 text-[#999999]" />
            </div>
            <h3 className="text-base font-semibold text-[#111111] mb-1">Brand kit not configured.</h3>
            <p className="text-xs text-[#666666]">
              Set up your brand colors, fonts, logo, and tone so the AI applies them across all creatives.
            </p>
          </div>

          <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden mb-6 text-xs">
            <div className="flex justify-between items-center p-3.5 bg-white">
              <span className="text-[#999999] font-medium">Logo</span>
              <span className="text-[#666666] font-semibold">Not uploaded</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-[#F7F7F7]">
              <span className="text-[#999999] font-medium">Primary Color</span>
              <span className="text-[#666666] font-semibold">Not configured</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-white">
              <span className="text-[#999999] font-medium">Secondary Color</span>
              <span className="text-[#666666] font-semibold">Not configured</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-[#F7F7F7]">
              <span className="text-[#999999] font-medium">Typography</span>
              <span className="text-[#666666] font-semibold">Default</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-white">
              <span className="text-[#999999] font-medium">Brand Tone</span>
              <span className="text-[#666666] font-semibold">Not configured</span>
            </div>
          </div>

          <button
            onClick={() => setIsConfiguring(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Configure Brand Kit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Brand Visual Standards Form */}
          <div className="lg:col-span-6 bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs text-[#666666]">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#111111]" />
              Brand Visual Guidelines
            </h3>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                <label className="block text-[#999999] text-[10px] uppercase font-bold mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.primaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-[#111111]">{brandKit.primaryColor}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                <label className="block text-[#999999] text-[10px] uppercase font-bold mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.secondaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-[#111111]">{brandKit.secondaryColor}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                <label className="block text-[#999999] text-[10px] uppercase font-bold mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.accentColor}
                    onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-[#111111]">{brandKit.accentColor}</span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[#999999] font-medium mb-1">Official Brand Tagline</label>
              <input
                type="text"
                value={brandKit.tagline}
                onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                placeholder="e.g. Quality You Can Trust"
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Brand Tone */}
            <div>
              <label className="block text-[#999999] font-medium mb-1">Brand Voice & Persona</label>
              <select
                value={brandKit.brandTone}
                onChange={(e) =>
                  setBrandKit({
                    ...brandKit,
                    brandTone: e.target.value as BrandKit['brandTone'],
                  })
                }
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              >
                <option value="friendly">Friendly & Neighborly (High retail trust)</option>
                <option value="premium">Premium & Luxurious (High-fashion / fine dining)</option>
                <option value="energetic">Energetic & Motivational (Fitness / Youth)</option>
                <option value="professional">Professional & Authoritative (Medical / B2B)</option>
                <option value="local">Deeply Local & Regional (Hinglish / Regional dialect)</option>
              </select>
            </div>

            {/* Contact Verification */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5]">
              <div>
                <span className="text-[10px] text-[#999999] block mb-1 font-medium">WhatsApp Booking</span>
                <div className="text-[#111111] font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {client?.businessInfo?.whatsapp || 'Not set'}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#999999] block mb-1 font-medium">Showroom Location</span>
                <div className="text-[#111111] font-medium truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                  {client?.businessInfo?.city || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Brand Consistency Score Calculator */}
          <div className="lg:col-span-6 bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#111111]" />
                  Brand Consistency Auditor
                </h3>
                <p className="text-[11px] text-[#999999]">
                  Audits copy against tone guidelines, local anchors, and required WhatsApp triggers.
                </p>
              </div>

              <button
                onClick={handleAuditScore}
                disabled={checking}
                className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold flex items-center gap-1 transition-all disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                <span>Audit Copy</span>
              </button>
            </div>

            <div>
              <label className="block text-[#999999] font-medium mb-1">
                Sample Copy to Evaluate:
              </label>
              <textarea
                rows={4}
                value={sampleCopy}
                onChange={(e) => setSampleCopy(e.target.value)}
                placeholder="Enter copy to audit against brand voice..."
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-3 text-[#111111] leading-relaxed focus:outline-none focus:border-[#111111]"
              />
            </div>

            {scoreResult && (
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-3">
                {/* Score Meter */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#666666]">Brand Alignment Score</span>
                  <span className="text-lg font-black text-[#111111]">
                    {scoreResult.score} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E5E5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#111111] transition-all duration-500"
                    style={{ width: `${scoreResult.score}%` }}
                  />
                </div>

                {/* Strengths */}
                {scoreResult.strengths.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#111111] block">
                      ✓ Verified Strengths
                    </span>
                    {scoreResult.strengths.map((s, idx) => (
                      <div key={idx} className="text-[#666666] flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Violations */}
                {scoreResult.violations.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#111111] block">
                      ⚠ Brand Rule Violations
                    </span>
                    {scoreResult.violations.map((v, idx) => (
                      <div key={idx} className="text-[#666666] flex items-start gap-1.5 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestion */}
                <div className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-[11px] text-[#111111]">
                  <span className="font-semibold text-[#111111]">Recommendation: </span>
                  {scoreResult.suggestion}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
