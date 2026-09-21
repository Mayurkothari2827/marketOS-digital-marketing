import React from 'react';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  PenTool,
  Palette,
  Calendar,
  Tag,
  BarChart3,
  Compass,
  Search,
  Settings,
  Repeat,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Store,
  MessageSquare,
} from 'lucide-react';
import { Client } from '../../types';

export type NavigationTab =
  | 'dashboard'
  | 'clients'
  | 'strategist'
  | 'campaigns'
  | 'content'
  | 'creative'
  | 'calendar'
  | 'offers'
  | 'repurpose'
  | 'brandkit'
  | 'competitors'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  clients: Client[];
  activeClient: Client | null;
  onSelectClient: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  agencyMode: boolean;
  setAgencyMode: (mode: boolean) => void;
  onOpenSearch: () => void;
  onOpenAIChat: () => void;
  onOpenWhatToPost: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  clients,
  activeClient,
  onSelectClient,
  isCollapsed,
  setIsCollapsed,
  agencyMode,
  setAgencyMode,
  onOpenSearch,
  onOpenAIChat,
  onOpenWhatToPost,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users, badge: `${clients.length}` },
    { id: 'strategist', label: 'AI Strategist', icon: Compass },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'content', label: 'Content Studio', icon: PenTool },
    { id: 'creative', label: 'Creative Studio', icon: Palette },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'repurpose', label: 'Repurpose', icon: Repeat },
    { id: 'brandkit', label: 'Brand Kit', icon: ShieldCheck },
    { id: 'competitors', label: 'Competitors', icon: Store },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
          >
            M
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
                MarketOS
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Marketing OS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Mode Switcher */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <div
            className="p-0.5 rounded-lg flex items-center text-xs"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setAgencyMode(true)}
              className="flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs"
              style={{
                backgroundColor: agencyMode ? 'var(--btn-primary-bg)' : 'transparent',
                color: agencyMode ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              }}
            >
              <Briefcase className="w-3 h-3" />
              Agency
            </button>
            <button
              onClick={() => setAgencyMode(false)}
              className="flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs"
              style={{
                backgroundColor: !agencyMode ? 'var(--btn-primary-bg)' : 'transparent',
                color: !agencyMode ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              }}
            >
              <Store className="w-3 h-3" />
              Client
            </button>
          </div>
        </div>
      )}

      {/* Active Client Selector */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <label
            className="text-[10px] font-semibold tracking-wider uppercase mb-1.5 block"
            style={{ color: 'var(--text-muted)' }}
          >
            Active Client
          </label>
          <div className="relative">
            <select
              value={activeClient?.id || ''}
              onChange={(e) => onSelectClient(e.target.value)}
              disabled={clients.length === 0}
              className="w-full text-xs font-medium rounded-lg px-3 py-2 appearance-none focus:outline-none transition-colors pr-8 cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              {clients.length === 0 ? (
                <option value="">No clients yet</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessInfo.businessName} ({c.businessInfo.city})
                  </option>
                ))
              )}
            </select>
            <div
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              ▼
            </div>
          </div>
          {activeClient && (
            <div className="flex items-center justify-between mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--success)' }}
                />
                {activeClient.businessInfo.category}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {activeClient.deliverablesDone.publishedThisMonth}/{activeClient.deliverablesTarget.contentPerMonth} Posts
              </span>
            </div>
          )}
        </div>
      )}

      {/* What to post today */}
      {!isCollapsed && (
        <div className="px-3 py-2">
          <button
            onClick={onOpenWhatToPost}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between group transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              What to post today?
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-muted)' }}
            >
              AI
            </span>
          </button>
        </div>
      )}

      {/* Search Trigger */}
      <div className="px-3 py-1">
        <button
          onClick={onOpenSearch}
          className={`w-full flex items-center gap-2 py-1.5 px-3 rounded-lg transition-colors text-xs ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
          title="Search anything (Cmd+K)"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Search...</span>}
          </span>
          {!isCollapsed && (
            <kbd
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--hover-bg)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavigationTab)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-all ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              style={{
                backgroundColor: isActive ? 'var(--hover-bg)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              title={item.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Trigger */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onOpenAIChat}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Open AI Marketing Copilot"
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--btn-primary-bg)' }}
          >
            <MessageSquare className="w-3 h-3" style={{ color: 'var(--btn-primary-text)' }} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left truncate flex-1">
              <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>AI Copilot</span>
              <span className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                {activeClient ? activeClient.businessInfo.businessName : 'Ready'}
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
