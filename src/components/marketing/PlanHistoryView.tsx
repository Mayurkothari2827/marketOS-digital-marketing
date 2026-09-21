import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Trash2,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { MarketingPlan } from '../../types/marketingPlan';
import { historyStore } from '../../services/storage/historyStore';

interface PlanHistoryViewProps {
  onSelectPlan: (plan: MarketingPlan) => void;
  onNewPlan: () => void;
}

export const PlanHistoryView: React.FC<PlanHistoryViewProps> = ({
  onSelectPlan,
  onNewPlan,
}) => {
  const [plans, setPlans] = useState<MarketingPlan[]>(historyStore.getPlans());

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this generated marketing plan?')) {
      historyStore.deletePlan(id);
      setPlans(historyStore.getPlans());
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#111111] tracking-tight">
              Marketing Plan History
            </h1>
            <p className="text-xs text-[#666666]">
              Access and export previously generated marketing solutions.
            </p>
          </div>
        </div>

        <button
          onClick={onNewPlan}
          className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Marketing Plan</span>
        </button>
      </div>

      {/* History List */}
      {plans.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-3">
            <FolderOpen className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">
            No marketing plans generated yet
          </h3>
          <p className="text-xs text-[#666666] max-w-sm mb-6">
            Enter details about a local business to generate your first complete marketing strategy, campaigns, and creatives.
          </p>
          <button
            onClick={onNewPlan}
            className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Create First Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-2xl bg-white overflow-hidden shadow-xs">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className="p-5 hover:bg-[#F7F7F7] cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111111] truncate">
                    {plan.businessInput.businessName}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5] shrink-0">
                    {plan.businessInput.category}
                  </span>
                </div>
                <p className="text-[#666666] truncate text-[11px]">
                  {plan.businessInput.location} · {plan.campaigns.length} Campaigns Available
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-[#999999] hidden sm:inline">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => handleDelete(plan.id, e)}
                  className="p-1.5 rounded-lg text-[#999999] hover:text-red-600 hover:bg-white transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 font-semibold text-[#111111]">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
