import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Settings, Plus, Layers } from 'lucide-react';
import { BusinessInputForm } from './components/marketing/BusinessInputForm';
import { MarketingPlanView } from './components/marketing/MarketingPlanView';
import { PlanHistoryView } from './components/marketing/PlanHistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { BusinessInput, MarketingPlan } from './types/marketingPlan';
import { generateMarketingPlan } from './services/ai/marketingPlanGenerator';
import { historyStore } from './services/storage/historyStore';

export function App() {
  const [activeTab, setActiveTab] = useState<'new' | 'plan' | 'history' | 'settings'>('new');
  const [currentPlan, setCurrentPlan] = useState<MarketingPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [historyCount, setHistoryCount] = useState(historyStore.getPlans().length);

  useEffect(() => {
    setHistoryCount(historyStore.getPlans().length);
  }, [activeTab, currentPlan]);

  const handleGenerate = async (input: BusinessInput) => {
    setIsGenerating(true);
    try {
      const plan = await generateMarketingPlan(input);
      historyStore.savePlan(plan);
      setCurrentPlan(plan);
      setActiveTab('plan');
      setHistoryCount(historyStore.getPlans().length);
    } catch (err) {
      console.error('Failed to generate marketing plan', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPlanFromHistory = (plan: MarketingPlan) => {
    setCurrentPlan(plan);
    setActiveTab('plan');
  };

  const handleNewPlan = () => {
    setCurrentPlan(null);
    setActiveTab('new');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
      {/* Top Header Navigation (Minimalist Monochrome) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={handleNewPlan}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111111] flex items-center justify-center text-white font-extrabold text-sm shadow-xs group-hover:bg-[#222222] transition-colors">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base text-[#111111]">
                  MarketOS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5] hidden sm:inline">
                  AI Marketing Dept
                </span>
              </div>
            </div>
          </div>

          {/* Clean Top Navigation Bar (Requirement 3) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleNewPlan}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'new' || (activeTab === 'plan' && !currentPlan)
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>

            {currentPlan && (
              <button
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'plan'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{currentPlan.businessInput.businessName}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History</span>
              {historyCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5]'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-xl text-xs transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 bg-white">
        {activeTab === 'new' && (
          <BusinessInputForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'plan' && currentPlan && (
          <MarketingPlanView
            plan={currentPlan}
            onNewPlan={handleNewPlan}
          />
        )}

        {activeTab === 'history' && (
          <PlanHistoryView
            onSelectPlan={handleSelectPlanFromHistory}
            onNewPlan={handleNewPlan}
          />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <SettingsView />
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E5E5E5] bg-[#FFFFFF] py-4 text-center text-xs text-[#999999]">
        MarketOS — AI Digital Marketing Department for Local Businesses
      </footer>
    </div>
  );
}

export default App;

