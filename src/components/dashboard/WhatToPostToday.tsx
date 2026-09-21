import React, { useState } from 'react';
import { Calendar, ArrowRight, Video, MessageSquare, Image, RefreshCw, Plus } from 'lucide-react';
import { Client, ProactiveRecommendation } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface WhatToPostTodayProps {
  activeClient: Client | null;
  onGenerateCreative: (rec: ProactiveRecommendation) => void;
  onGenerateReel: (rec: ProactiveRecommendation) => void;
  onGenerateWhatsApp: (rec: ProactiveRecommendation) => void;
  onFullCampaign: (rec: ProactiveRecommendation) => void;
  onNewClientModal?: () => void;
}

export const WhatToPostToday: React.FC<WhatToPostTodayProps> = ({
  activeClient,
  onGenerateCreative,
  onGenerateReel,
  onGenerateWhatsApp,
  onFullCampaign,
  onNewClientModal,
}) => {
  const [recommendations, setRecommendations] = useState<ProactiveRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    if (!activeClient) return;
    setLoading(true);
    try {
      const provider = aiManager.getProvider();
      const fresh = await provider.getDailyRecommendations(activeClient);
      if (fresh && fresh.length > 0) {
        setRecommendations(fresh);
      }
    } catch {
      // fallback handled in provider
    } finally {
      setLoading(false);
    }
  };

  // If no active client, render Req 7 empty state
  if (!activeClient) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          What should I post today?
        </h2>
        <p className="text-xs mt-1.5 mb-4 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Add a client first to generate personalized marketing recommendations.
        </p>
        {onNewClientModal && (
          <button
            onClick={onNewClientModal}
            className="py-2 px-4 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            What should I post today?
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            AI analysis based on {activeClient.businessInfo.city} market dynamics, active offerings, and business goals.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : recommendations.length > 0 ? 'Refresh' : 'Generate Recommendations'}</span>
        </button>
      </div>

      {/* Cards Grid or Empty Generator */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.id || index}
              className="rounded-lg p-4 flex flex-col justify-between transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                {/* Badge & Type */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--hover-bg)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    #{index + 1}
                  </span>
                  <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Calendar className="w-3 h-3" />
                    {rec.campaignType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {rec.title}
                </h3>

                {/* Why */}
                <div
                  className="mb-2.5 p-2.5 rounded-md"
                  style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>
                    Why Now:
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec.why}</p>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium shrink-0" style={{ color: 'var(--text-muted)' }}>Offer:</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{rec.offer}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium shrink-0" style={{ color: 'var(--text-muted)' }}>CTA:</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{rec.cta}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-2 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onGenerateCreative(rec)}
                    className="py-1.5 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                    title="Generate Visual Creative"
                  >
                    <Image className="w-3 h-3" />
                    <span>Creative</span>
                  </button>
                  <button
                    onClick={() => onGenerateReel(rec)}
                    className="py-1.5 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                    title="Generate 30s Reel Script"
                  >
                    <Video className="w-3 h-3" />
                    <span>Reel</span>
                  </button>
                  <button
                    onClick={() => onGenerateWhatsApp(rec)}
                    className="py-1.5 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }}
                    title="Generate WhatsApp Broadcast"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <button
                  onClick={() => onFullCampaign(rec)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  <span>Launch Full Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            No recommendations generated yet for {activeClient.businessInfo.businessName}.
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="py-2 px-4 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating Recommendations...' : 'Generate Today\'s Recommendations'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
