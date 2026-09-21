import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  RefreshCw,
  Target,
  ArrowRight,
  Calendar,
  Package,
} from 'lucide-react';
import { Client, StrategistOutput, ProactiveRecommendation } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface AIMarketingStrategistProps {
  client: Client;
  onLaunchCampaign: (rec: ProactiveRecommendation) => void;
  onNavigateToProfile?: () => void;
}

export const AIMarketingStrategist: React.FC<AIMarketingStrategistProps> = ({
  client,
  onLaunchCampaign,
  onNavigateToProfile,
}) => {
  const [strategy, setStrategy] = useState<StrategistOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStrategy = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const provider = aiManager.getProvider();
      const res = await provider.generateStrategy(client);
      setStrategy(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client?.products && client.products.length > 0) {
      loadStrategy();
    }
  }, [client?.id]);

  const hasProducts = client?.products && client.products.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#111111] tracking-tight">
                AI Marketing Strategist
              </h2>
              {client?.businessInfo?.city && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                  {client.businessInfo.city} Edition
                </span>
              )}
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Autonomous strategic analysis for {client?.businessInfo?.businessName || 'your business'} based on local market dynamics and real client data.
            </p>
          </div>
        </div>

        {hasProducts && (
          <button
            onClick={loadStrategy}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold border border-[#E5E5E5] transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#111111]' : ''}`} />
            <span>Regenerate Strategy Blueprint</span>
          </button>
        )}
      </div>

      {!hasProducts ? (
        /* Missing Information Guardrail (Requirement 19) */
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">
            Add at least one product before generating a strategy
          </h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            The AI builds marketing blueprints using your verified products, target audience, and business facts—never invented information.
          </p>
          {onNavigateToProfile && (
            <button
              onClick={onNavigateToProfile}
              className="px-5 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Manage Client Profile & Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-[#999999] text-xs flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#111111] border-t-transparent animate-spin" />
          <span>Synthesizing real client profile and market dynamics...</span>
        </div>
      ) : strategy ? (
        <>
          {/* Business Analysis Section */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#111111]" />
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                1. Local Business Positioning & Opportunities
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1.5">
                <span className="text-[11px] font-bold text-[#111111] block">
                  Market Positioning
                </span>
                <p className="text-[#666666] leading-relaxed">
                  {strategy.businessAnalysis.positioning}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1.5">
                <span className="text-[11px] font-bold text-[#111111] block">
                  Target Audience Matrix
                </span>
                <p className="text-[#666666] leading-relaxed">
                  {strategy.businessAnalysis.targetAudienceMatrix}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-2">
                <span className="text-[11px] font-bold text-[#111111] block">
                  Customer Pain Points to Address
                </span>
                <ul className="space-y-1.5 text-[#666666]">
                  {strategy.businessAnalysis.customerPainPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#111111]">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-2">
                <span className="text-[11px] font-bold text-[#111111] block">
                  Key Buying Triggers
                </span>
                <ul className="space-y-1.5 text-[#666666]">
                  {strategy.businessAnalysis.buyingTriggers.map((trig, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Marketing Strategy: Monthly & Weekly Rhythms */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#111111]" />
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                  2. Monthly Theme & Weekly Execution Schedule
                </h3>
              </div>
              <span className="text-xs text-[#111111] font-semibold px-2.5 py-0.5 rounded-full bg-[#F7F7F7] border border-[#E5E5E5]">
                {strategy.marketingStrategy.monthlyTheme}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {strategy.marketingStrategy.weeklyThemes.map((w) => (
                <div
                  key={w.week}
                  className="p-3.5 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-[#999999] uppercase tracking-wider mb-1">
                      Week {w.week} Rhythm
                    </div>
                    <div className="font-bold text-[#111111] mb-2">{w.focus}</div>
                    <p className="text-[#666666] text-[11px] leading-relaxed">{w.rationale}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Pillars */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#999999] uppercase tracking-wider block mb-2">
                Content Pillars Ratio
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {strategy.marketingStrategy.contentPillars.map((cp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-[#111111]">{cp.pillar}</span>
                      <span className="font-bold text-[#111111]">{cp.percent}%</span>
                    </div>
                    <p className="text-[11px] text-[#666666]">{cp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proactive Campaign Recommendations */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                3. Proactive High-Conviction Campaign Recommendations
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {strategy.recommendations.map((rec, i) => (
                <div
                  key={rec.id || i}
                  className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] hover:border-[#111111]/40 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#111111] px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">
                        Recommendation #{i + 1}
                      </span>
                      <span className="text-[11px] text-[#666666]">{rec.campaignType}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#111111]">{rec.title}</h4>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] space-y-1">
                      <span className="text-[10px] font-semibold text-[#999999] uppercase">Why:</span>
                      <p className="text-[#666666] text-[11px] leading-relaxed">{rec.why}</p>
                    </div>

                    <div className="space-y-1 text-[#666666] text-[11px]">
                      <div>
                        <span className="text-[#999999]">Offer: </span>
                        <span className="text-[#111111] font-medium">{rec.offer}</span>
                      </div>
                      <div>
                        <span className="text-[#999999]">Audience: </span>
                        <span>{rec.targetAudience}</span>
                      </div>
                      <div>
                        <span className="text-[#999999]">CTA: </span>
                        <span className="text-[#111111] font-semibold">{rec.cta}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchCampaign(rec)}
                    className="mt-4 w-full py-2 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Launch Campaign Machine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
