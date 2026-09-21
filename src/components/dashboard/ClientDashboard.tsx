import React from 'react';
import {
  Megaphone,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Zap,
} from 'lucide-react';
import { Client, Campaign } from '../../types';
import { WhatToPostToday } from './WhatToPostToday';
import { ProactiveRecommendation } from '../../types';

interface ClientDashboardProps {
  client: Client;
  campaigns: Campaign[];
  onNavigateTab: (tab: string) => void;
  onLaunchCampaign: (rec: ProactiveRecommendation) => void;
  onGenerateCreative: (rec: ProactiveRecommendation) => void;
  onGenerateReel: (rec: ProactiveRecommendation) => void;
  onGenerateWhatsApp: (rec: ProactiveRecommendation) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  client,
  campaigns,
  onNavigateTab,
  onLaunchCampaign,
  onGenerateCreative,
  onGenerateReel,
  onGenerateWhatsApp,
}) => {
  const clientCampaigns = campaigns.filter((c) => c.clientId === client.id);
  const activeCampaign = clientCampaigns[0];

  const contentTarget = client.deliverablesTarget?.contentPerMonth || 20;
  const contentDone = client.deliverablesDone?.publishedThisMonth || 0;
  const contentPercent = Math.min(
    100,
    Math.round((contentDone / contentTarget) * 100)
  );

  // Dynamic next actions based on current client setup
  const recommendedActions = [];

  if (client.products.length === 0) {
    recommendedActions.push({
      title: 'Add Your First Product',
      desc: 'Catalog items are needed to formulate targeted campaigns',
      tab: 'clients',
    });
  }

  if (clientCampaigns.length === 0) {
    recommendedActions.push({
      title: 'Create Your First Campaign',
      desc: 'Launch a 1-click multi-channel campaign pack',
      tab: 'campaigns',
    });
  }

  recommendedActions.push({
    title: 'Generate Local Marketing Strategy',
    desc: `Autonomous market analysis for ${client.businessInfo.city}`,
    tab: 'strategist',
  });

  recommendedActions.push({
    title: 'Draft WhatsApp Broadcast',
    desc: 'High-conversion copy for customer outreach',
    tab: 'content',
  });

  recommendedActions.push({
    title: 'Design Marketing Creative',
    desc: 'Render high-resolution promotional artwork',
    tab: 'creative',
  });

  const displayedActions = recommendedActions.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Client Hero Card */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderLeftWidth: '4px',
          borderLeftColor: client.brandKit?.primaryColor || 'var(--text-primary)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0"
              style={{ backgroundColor: client.brandKit?.primaryColor || 'var(--btn-primary-bg)' }}
            >
              {client.businessInfo.businessName[0] || 'C'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {client.businessInfo.businessName}
                </h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {client.businessInfo.category}
                </span>
              </div>

              {client.brandKit?.tagline && (
                <p className="text-xs italic mt-1" style={{ color: 'var(--text-muted)' }}>
                  &ldquo;{client.brandKit.tagline}&rdquo;
                </p>
              )}

              <div className="flex items-center gap-4 text-xs mt-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {client.businessInfo.city}{client.businessInfo.state ? `, ${client.businessInfo.state}` : ''}
                </span>
                {client.businessInfo.whatsapp && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {client.businessInfo.whatsapp}
                  </span>
                )}
                <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          {/* Deliverables summary */}
          <div
            className="p-4 rounded-lg flex items-center gap-6 shrink-0"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Monthly Progress</div>
              <div className="text-xl font-semibold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {contentPercent}%
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {client.deliverablesDone?.publishedThisMonth || 0} / {contentTarget} Published
              </div>
            </div>

            <div className="w-px h-10" style={{ backgroundColor: 'var(--border)' }} />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>Campaigns:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{client.deliverablesDone?.campaignsThisMonth || 0}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>Creatives:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{client.deliverablesDone?.creativesThisMonth || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What to Post Today */}
      <WhatToPostToday
        activeClient={client}
        onGenerateCreative={onGenerateCreative}
        onGenerateReel={onGenerateReel}
        onGenerateWhatsApp={onGenerateWhatsApp}
        onFullCampaign={onLaunchCampaign}
      />

      {/* Active Campaign & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Campaign */}
        <div
          className="lg:col-span-2 rounded-xl p-5 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Current Campaign
                </h3>
              </div>
              {activeCampaign && (
                <span
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {activeCampaign.campaignType}
                </span>
              )}
            </div>

            {activeCampaign ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{activeCampaign.name}</h4>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{activeCampaign.coreMessage}</p>
                </div>

                <div
                  className="p-3 rounded-lg space-y-2 text-xs"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activeCampaign.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${activeCampaign.progressPercent}%`, backgroundColor: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  {[
                    { label: 'Objective', value: activeCampaign.objective },
                    { label: 'Offer', value: activeCampaign.offer },
                    { label: 'Duration', value: activeCampaign.duration },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-2.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                      <div className="font-medium truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No active campaign yet. Launch one from Campaign Studio!
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>{activeCampaign ? 'View Campaign Assets' : 'Create Campaign'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('creative')}
              className="py-1.5 px-3 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Open Creative Studio
            </button>
          </div>
        </div>

        {/* Next Actions */}
        <div
          className="rounded-xl p-5 flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Recommended Actions
              </h3>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              AI-generated next best steps:
            </p>

            <div className="space-y-2">
              {displayedActions.map((act, i) => (
                <div
                  key={i}
                  onClick={() => onNavigateTab(act.tab)}
                  className="p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center font-semibold text-[10px]"
                      style={{
                        backgroundColor: 'var(--btn-primary-bg)',
                        color: 'var(--btn-primary-text)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {act.title}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{act.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => onNavigateTab('strategist')}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              Open AI Marketing Strategist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
