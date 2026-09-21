import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Database,
  Trash2,
  Check,
  Code,
  Copy,
} from 'lucide-react';
import { aiManager } from '../../services/ai/aiManager';
import { clientStore } from '../../services/storage/clientStore';
import { campaignStore } from '../../services/storage/campaignStore';
import { historyStore } from '../../services/storage/historyStore';
import { AIProviderConfig } from '../../types';

export const SettingsView: React.FC = () => {
  const [config, setConfig] = useState<AIProviderConfig>(aiManager.getConfig());
  const [saved, setSaved] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase configuration
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('marketos_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('marketos_supabase_key') || ''
  );

  const handleSave = () => {
    aiManager.setConfig(config);
    if (supabaseUrl) localStorage.setItem('marketos_supabase_url', supabaseUrl);
    if (supabaseKey) localStorage.setItem('marketos_supabase_key', supabaseKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAllData = () => {
    if (confirm('Clear all workspace data (plans, history, cache)? The application will return to a completely empty state.')) {
      historyStore.clearAll();
      clientStore.clearAll();
      campaignStore.clearAll();
      localStorage.removeItem('marketos_supabase_url');
      localStorage.removeItem('marketos_supabase_key');
      window.location.reload();
    }
  };

  const sqlSchemaCode = `-- ==========================================
-- MarketOS: Local Business Marketing OS PostgreSQL Schema
-- ==========================================

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    city TEXT NOT NULL,
    state TEXT,
    phone TEXT,
    whatsapp TEXT NOT NULL,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    address TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC NOT NULL,
    discount_percent INT DEFAULT 0,
    features TEXT[],
    brands TEXT[],
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    primary_color TEXT DEFAULT '#111111',
    secondary_color TEXT DEFAULT '#666666',
    accent_color TEXT DEFAULT '#f59e0b',
    font_heading TEXT DEFAULT 'Plus Jakarta Sans',
    font_body TEXT DEFAULT 'Plus Jakarta Sans',
    brand_tone TEXT DEFAULT 'friendly',
    tagline TEXT,
    visual_style TEXT
);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    campaign_type TEXT NOT NULL,
    objective TEXT,
    target_audience TEXT,
    core_message TEXT,
    offer TEXT,
    duration TEXT,
    status TEXT DEFAULT 'Ready',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    content_type TEXT NOT NULL,
    headline TEXT,
    primary_copy TEXT,
    caption TEXT,
    cta TEXT,
    hashtags TEXT[],
    visual_direction TEXT,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    successful_content JSONB,
    failed_content JSONB,
    customer_insights TEXT[],
    campaign_history TEXT[],
    brand_preferences TEXT[]
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Settings & Platform Architecture
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Multi-provider AI configuration, Supabase database synchronization, and data backups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* AI Provider Abstraction Configuration */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#111111]" />
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
            AI Engine Provider Abstraction
          </h3>
        </div>
        <p className="text-[#666666] leading-relaxed">
          The application uses a flexible provider abstraction. You can run completely offline with the zero-latency Built-in Local Business Intelligence Engine, or plug in your Gemini/OpenAI/Claude API keys.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            {
              id: 'local',
              title: 'Built-in Local Intelligence',
              desc: 'High-fidelity heuristic engine. 0 API key required, zero latency, highly localized for Indian retail.',
            },
            {
              id: 'gemini',
              title: 'Google Gemini (Flash / Pro)',
              desc: 'Direct integration with Gemini 2.0 / 1.5 Flash models via API key.',
            },
            {
              id: 'openai',
              title: 'OpenAI (GPT-4o)',
              desc: 'Provider hook ready for OpenAI GPT-4o enterprise models.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setConfig({ ...config, provider: item.id as AIProviderConfig['provider'] })}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                config.provider === item.id
                  ? 'bg-[#F7F7F7] border-[#111111] text-[#111111] shadow-sm'
                  : 'bg-white border-[#E5E5E5] text-[#666666] hover:text-[#111111] hover:border-[#111111]'
              }`}
            >
              <div>
                <div className="font-bold text-[#111111] flex items-center justify-between mb-1">
                  <span>{item.title}</span>
                  {config.provider === item.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#111111] mt-2 block">
                {config.provider === item.id ? 'Active Provider' : 'Select'}
              </span>
            </div>
          ))}
        </div>

        {config.provider === 'gemini' && (
          <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-3 pt-3">
            <div>
              <label className="block text-[#666666] font-medium mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] font-mono text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="block text-[#666666] font-medium mb-1">Model Name</label>
              <select
                value={config.modelName || 'gemini-1.5-flash'}
                onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (Deep reasoning)</option>
                <option value="gemini-2.0-flash-exp">gemini-2.0-flash-exp</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Supabase Database Architecture */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#111111]" />
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Supabase PostgreSQL Database Connector
            </h3>
          </div>
          <button
            onClick={() => setShowSqlSchema(!showSqlSchema)}
            className="text-xs text-[#111111] hover:underline font-semibold flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showSqlSchema ? 'Hide SQL Schema' : 'View SQL Schema'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#999999] font-medium mb-1">Supabase Project URL</label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-mono text-xs focus:outline-none focus:border-[#111111]"
            />
          </div>
          <div>
            <label className="block text-[#999999] font-medium mb-1">Supabase Anon Key</label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-mono text-xs focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        {showSqlSchema && (
          <div className="p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#999999]">
                PostgreSQL Schema Definition (Ready to paste in Supabase SQL Editor)
              </span>
              <button
                onClick={copySql}
                className="text-xs text-[#111111] hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-white rounded-lg text-[#111111] font-mono text-[10px] overflow-x-auto max-h-56 leading-relaxed border border-[#E5E5E5]">
              {sqlSchemaCode}
            </pre>
          </div>
        )}
      </div>

      {/* Clear Workspace Data (Clean State) */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="font-bold text-[#111111] text-sm">Clear All Workspace Data</h4>
          <p className="text-[#666666] mt-0.5">
            Removes all locally stored clients, campaigns, and content to reset MarketOS into a completely clean, empty state.
          </p>
        </div>

        <button
          onClick={handleClearAllData}
          className="py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Workspace Data</span>
        </button>
      </div>
    </div>
  );
};
