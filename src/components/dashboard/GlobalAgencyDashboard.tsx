import React from 'react';
import {
  Users,
  Megaphone,
  PenTool,
  Palette,
  Clock,
  CalendarCheck,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  AlertTriangle,
} from 'lucide-react';
import { Client, Campaign } from '../../types';
import { WhatToPostToday } from './WhatToPostToday';
import { ProactiveRecommendation } from '../../types';

interface GlobalAgencyDashboardProps {
  clients: Client[];
  campaigns: Campaign[];
  activeClient: Client | null;
  onSelectClient: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onLaunchCampaign: (rec: ProactiveRecommendation) => void;
  onGenerateCreative: (rec: ProactiveRecommendation) => void;
  onGenerateReel: (rec: ProactiveRecommendation) => void;
  onGenerateWhatsApp: (rec: ProactiveRecommendation) => void;
  onNewClientModal: () => void;
}

export const GlobalAgencyDashboard: React.FC<GlobalAgencyDashboardProps> = ({
  clients,
  campaigns,
  activeClient,
  onSelectClient,
  onNavigateTab,
  onLaunchCampaign,
  onGenerateCreative,
  onGenerateReel,
  onGenerateWhatsApp,
  onNewClientModal,
}) => {
  // Requirement 18: Empty state when no clients exist
  if (clients.length === 0) {
    return (
      <div className="space-y-6 pb-12 animate-fadeIn">
        <div
          className="p-12 rounded-xl text-center max-w-lg mx-auto my-12"
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-lg"
            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
          >
            M
          </div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            MarketOS
          </h1>
          <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>
            Welcome back.
          </p>
          <p className="text-xs mt-1 mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            You don&apos;t have any clients yet. Create your first client to start building campaigns.
          </p>
          <button
            onClick={onNewClientModal}
            className="py-2.5 px-5 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-all shadow-sm"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <Users className="w-4 h-4" />
            <span>+ Add Client</span>
          </button>
        </div>
      </div>
    );
  }

  const totalClients = clients.length;
  const activeCampaignsCount = campaigns.length;
  const totalContentGenerated = clients.reduce(
    (acc, c) => acc + (c.deliverablesDone?.contentThisMonth || 0),
    0
  );
  const totalCreativesGenerated = clients.reduce(
    (acc, c) => acc + (c.deliverablesDone?.creativesThisMonth || 0),
    0
  );
  const totalPublished = clients.reduce(
    (acc, c) => acc + (c.deliverablesDone?.publishedThisMonth || 0),
    0
  );
  const pendingCount = campaigns.filter((c) => c.status === 'Draft' || c.status === 'Ready').length;

  // Real, dynamic alerts derived from actual client accounts
  const agencyAlerts: { id: string; type: 'urgent' | 'festival' | 'opportunity'; text: string; actionClient: string; actionTab: string; actionLabel: string }[] = [];

  clients.forEach((c) => {
    const clientCampaigns = campaigns.filter((camp) => camp.clientId === c.id);
    if (clientCampaigns.length === 0 && agencyAlerts.length < 3) {
      agencyAlerts.push({
        id: `alt-camp-${c.id}`,
        type: 'urgent',
        text: `${c.businessInfo.businessName} has no active campaigns created yet.`,
        actionClient: c.id,
        actionTab: 'campaigns',
        actionLabel: 'Create Campaign',
      });
    } else if (c.products.length === 0 && agencyAlerts.length < 3) {
      agencyAlerts.push({
        id: `alt-prod-${c.id}`,
        type: 'opportunity',
        text: `${c.businessInfo.businessName} has no products configured. Add a catalog to unlock AI generations.`,
        actionClient: c.id,
        actionTab: 'clients',
        actionLabel: 'Add Products',
      });
    }
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Agency Command Center
            </h1>
            <span
              className="text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
              style={{
                backgroundColor: 'var(--bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              {totalClients} {totalClients === 1 ? 'Client' : 'Clients'} Active
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Managing {totalClients} active local {totalClients === 1 ? 'business' : 'businesses'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewClientModal}
            className="py-2 px-3.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Onboard New Client</span>
          </button>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="py-2 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Campaign Machine</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Clients', value: totalClients, icon: Users },
          { label: 'Campaigns', value: activeCampaignsCount, icon: Megaphone },
          { label: 'Content Pieces', value: totalContentGenerated, icon: PenTool },
          { label: 'Creatives', value: totalCreativesGenerated, icon: Palette },
          { label: 'Pending', value: pendingCount, icon: Clock },
          { label: 'Published', value: totalPublished, icon: CalendarCheck },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-xl p-4 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Alerts */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            AI Insights & Alerts
          </h3>
        </div>
        {agencyAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {agencyAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-lg flex flex-col justify-between text-xs space-y-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-start gap-2">
                  {alt.type === 'urgent' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
                  ) : alt.type === 'festival' ? (
                    <CalendarCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                  ) : (
                    <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                  )}
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">{alt.text}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectClient(alt.actionClient);
                    onNavigateTab(alt.actionTab);
                  }}
                  className="self-end text-[11px] font-medium flex items-center gap-1 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span>{alt.actionLabel}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            All client accounts and campaign schedules are in good standing.
          </div>
        )}
      </div>

      {/* What to Post Today */}
      <WhatToPostToday
        activeClient={activeClient}
        onGenerateCreative={onGenerateCreative}
        onGenerateReel={onGenerateReel}
        onGenerateWhatsApp={onGenerateWhatsApp}
        onFullCampaign={onLaunchCampaign}
        onNewClientModal={onNewClientModal}
      />

      {/* Workload Table */}
      <div
        className="rounded-xl p-5 overflow-hidden"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Client Workload & Deliverables
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Monthly content commitments, creatives, and published status per client.
            </p>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Click any client to switch context
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="text-[10px] uppercase font-semibold tracking-wider border-y"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            >
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Category & City</th>
                <th className="py-3 px-4">Content</th>
                <th className="py-3 px-4">Creatives</th>
                <th className="py-3 px-4">Campaigns</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              {clients.map((c) => {
                const isSelected = activeClient ? c.id === activeClient.id : false;
                const contentTarget = c.deliverablesTarget?.contentPerMonth || 20;
                const contentDone = c.deliverablesDone?.contentThisMonth || 0;
                const contentPercent = Math.min(100, Math.round((contentDone / contentTarget) * 100));

                const creativeTarget = c.deliverablesTarget?.creativesPerMonth || 12;
                const creativeDone = c.deliverablesDone?.creativesThisMonth || 0;
                const creativePercent = Math.min(100, Math.round((creativeDone / creativeTarget) * 100));

                const campaignsDone = c.deliverablesDone?.campaignsThisMonth || 0;
                const campaignsTarget = c.deliverablesTarget?.campaignsPerMonth || 4;

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectClient(c.id)}
                    className="cursor-pointer transition-colors border-b"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: isSelected ? 'var(--hover-bg)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-white text-xs shrink-0"
                          style={{ backgroundColor: c.brandKit?.primaryColor || '#111111' }}
                        >
                          {c.businessInfo.businessName[0] || 'C'}
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {c.businessInfo.businessName}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {c.marketingGoals?.preferredLanguage || 'English'} • {c.products.length} Products
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div style={{ color: 'var(--text-primary)' }}>{c.businessInfo.category}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.businessInfo.city}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {contentDone}/{contentTarget}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{contentPercent}%</span>
                      </div>
                      <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${contentPercent}%`, backgroundColor: 'var(--text-primary)' }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {creativeDone}/{creativeTarget}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{creativePercent}%</span>
                      </div>
                      <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${creativePercent}%`, backgroundColor: 'var(--text-primary)' }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {campaignsDone}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}> / {campaignsTarget}</span>
                    </td>
                    <td className="py-3 px-4">
                      {c.status === 'On Track' ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          On Track
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--warning)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Needs Attention
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClient(c.id);
                          onNavigateTab('clients');
                        }}
                        className="py-1 px-2.5 rounded-md text-[11px] transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
