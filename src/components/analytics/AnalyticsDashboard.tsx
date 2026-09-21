import React from 'react';
import {
  BarChart3,
  Megaphone,
  FileText,
  Palette,
  CheckCircle2,
  Users,
  Eye,
} from 'lucide-react';
import { Client, Campaign } from '../../types';

interface AnalyticsDashboardProps {
  client: Client;
  campaigns?: Campaign[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  client,
  campaigns = [],
}) => {
  const activeCampaigns = campaigns.filter((c) => c.clientId === client?.id) || [];
  const totalCampaigns = activeCampaigns.length;
  const totalContent = activeCampaigns.reduce((acc, c) => acc + (c.contentAssets?.length || 0), 0);
  const publishedCount = activeCampaigns.reduce(
    (acc, c) => acc + (c.contentAssets?.filter((a) => a.status === 'Published').length || 0),
    0
  );
  const creativesCount = activeCampaigns.reduce(
    (acc, c) => acc + (c.contentAssets?.filter((a) => Boolean(a.visualDirection)).length || 0),
    0
  );
  const leadsCount = 0;

  const kpis = [
    { label: 'Campaigns', value: totalCampaigns.toString(), icon: Megaphone },
    { label: 'Content', value: totalContent.toString(), icon: FileText },
    { label: 'Creatives', value: creativesCount.toString(), icon: Palette },
    { label: 'Published', value: publishedCount.toString(), icon: CheckCircle2 },
    { label: 'Leads', value: leadsCount.toString(), icon: Users },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Campaign Analytics & Performance
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Live performance metrics and deliverable tracking for {client?.businessInfo?.businessName || 'your business'}.
            </p>
          </div>
        </div>

        <span className="text-xs text-[#111111] font-semibold px-3 py-1 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5]">
          Live Data Active
        </span>
      </div>

      {/* Real KPI Cards Grid (Requirement 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#999999] font-medium">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#111111]" />
              </div>
              <div className="text-2xl font-bold text-[#111111] tracking-tight">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Activity Status / Empty State (Requirements 12 & 20) */}
      {totalCampaigns === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">Analytics will appear once you have campaign activity.</h3>
          <p className="text-sm text-[#666666] max-w-sm">
            No data available yet. Create campaigns and publish content to track reach, impressions, and customer inquiries.
          </p>
        </div>
      ) : (
        /* Real Campaign Performance Table */
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 overflow-hidden text-xs">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-3">
            Active Campaign Deliverables & Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[#666666]">
              <thead className="bg-[#F7F7F7] text-[10px] uppercase font-bold text-[#999999] border-y border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total Assets</th>
                  <th className="py-3 px-4">Published Assets</th>
                  <th className="py-3 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] font-medium">
                {activeCampaigns.map((c) => {
                  const publishedAssets = c.contentAssets?.filter((a) => a.status === 'Published').length || 0;
                  return (
                    <tr key={c.id} className="hover:bg-[#F7F7F7] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#111111]">{c.name}</td>
                      <td className="py-3 px-4 text-[#666666]">{c.campaignType}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#111111] font-bold">{c.contentAssets?.length || 0}</td>
                      <td className="py-3 px-4 text-[#111111] font-bold">{publishedAssets}</td>
                      <td className="py-3 px-4 text-right text-[#999999]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
