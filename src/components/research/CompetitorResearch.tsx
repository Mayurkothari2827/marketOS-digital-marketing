import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  Plus,
  ExternalLink,
  Target,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Client, CompetitorInsight } from '../../types';

interface CompetitorResearchProps {
  client: Client;
  onLaunchExploitationCampaign: (opportunity: string) => void;
}

export const CompetitorResearch: React.FC<CompetitorResearchProps> = ({
  client,
  onLaunchExploitationCampaign,
}) => {
  const [competitors, setCompetitors] = useState<CompetitorInsight[]>([]);
  const [newCompetitorName, setNewCompetitorName] = useState('');

  const handleAddCompetitor = () => {
    if (!newCompetitorName.trim()) return;
    const newComp: CompetitorInsight = {
      id: `comp-${Date.now()}`,
      clientId: client?.id || 'client-default',
      competitorName: newCompetitorName,
      category: client?.businessInfo?.category || 'Retail',
      positioning: 'Local competitor with standard promotional activity',
      contentThemes: ['Price promotions', 'Local updates'],
      offersObserved: ['Standard promotional discount'],
      creativeStyle: 'Simple promotional snapshots and flyers',
      postingFrequency: 'Weekly social posts',
      vulnerabilitiesAndGaps: [
        'Slow customer response time on WhatsApp',
        'No direct video / Reel demonstrations',
      ],
      opportunityForClient: `Lead with express local delivery and direct WhatsApp instant response in ${client?.businessInfo?.city || 'town'}.`,
    };
    setCompetitors([newComp, ...competitors]);
    setNewCompetitorName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Competitor Intelligence & Vulnerability Radar
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Structured observations on positioning, offer angles, and actionable gaps to exploit in {client?.businessInfo?.city || 'your area'}.
            </p>
          </div>
        </div>

        {/* Quick Add Competitor */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Competitor Name or Store..."
            value={newCompetitorName}
            onChange={(e) => setNewCompetitorName(e.target.value)}
            className="bg-white border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] w-52"
          />
          <button
            onClick={handleAddCompetitor}
            className="py-1.5 px-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Competitors Grid */}
      {competitors.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">No competitors tracked yet.</h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            Add local businesses and competitors in your area to monitor their marketing angles and uncover actionable gaps.
          </p>
          <div className="flex items-center gap-2 max-w-xs w-full">
            <input
              type="text"
              placeholder="Competitor Name..."
              value={newCompetitorName}
              onChange={(e) => setNewCompetitorName(e.target.value)}
              className="flex-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
            />
            <button
              onClick={handleAddCompetitor}
              className="px-4 py-2 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col justify-between text-xs space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                      {comp.competitorName}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#666666]">
                        {comp.category}
                      </span>
                    </h3>
                    {comp.googleProfile && (
                      <div className="text-[11px] text-[#666666] mt-0.5">
                        ⭐ {comp.googleProfile}
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-[#999999] font-medium">
                    {comp.postingFrequency}
                  </div>
                </div>

                {/* Observed Positioning & Content Themes */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Positioning Observed
                    </span>
                    <p className="text-[#666666] leading-relaxed">{comp.positioning}</p>
                  </div>

                  <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5]">
                    <span className="text-[10px] font-bold uppercase text-[#999999] block mb-1">
                      Creative Style
                    </span>
                    <p className="text-[#666666] leading-relaxed">{comp.creativeStyle}</p>
                  </div>
                </div>

                {/* Vulnerabilities & Gaps */}
                <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Competitor Gaps & Weaknesses
                  </span>
                  <ul className="space-y-1 text-[#666666] text-[11px]">
                    {comp.vulnerabilitiesAndGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#111111]">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunity for our client */}
                <div className="p-3.5 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                    Actionable Opportunity for {client?.businessInfo?.businessName || 'Your Business'}
                  </span>
                  <p className="text-[#111111] font-medium text-xs leading-relaxed">
                    {comp.opportunityForClient}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onLaunchExploitationCampaign(comp.opportunityForClient)}
                  className="w-full py-2 px-3 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Launch Counter-Campaign in Campaign Machine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
