import React from 'react';
import {
  Bell,
  Search,
  Sun,
  Moon,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Client } from '../../types';

interface HeaderProps {
  activeTabTitle: string;
  activeClient: Client | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSearch: () => void;
  onOpenWhatToPost: () => void;
  onNewCampaign: () => void;
  onNewClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTabTitle,
  activeClient,
  darkMode,
  setDarkMode,
  onOpenSearch,
  onOpenWhatToPost,
  onNewCampaign,
  onNewClient,
}) => {
  return (
    <header
      className="h-14 px-6 border-b flex items-center justify-between sticky top-0 z-20"
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span>MarketOS</span>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeTabTitle}</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {activeTabTitle}
          </h1>
        </div>

        <div className="h-5 w-px hidden md:block mx-1" style={{ backgroundColor: 'var(--border)' }} />

        {/* Active Client Badge */}
        {activeClient ? (
          <div
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--success)' }}
            />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {activeClient.businessInfo.businessName}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {activeClient.businessInfo.city}
            </span>
            {activeClient.businessInfo.website && (
              <a
                href={activeClient.businessInfo.website}
                target="_blank"
                rel="noreferrer"
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="Visit client website"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          <div
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#999999]" />
            <span>No Active Client</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* What to post today */}
        <button
          onClick={onOpenWhatToPost}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          What to post today?
        </button>

        {/* New Campaign */}
        <button
          onClick={onNewCampaign}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Campaign
        </button>

        {/* Add Client */}
        <button
          onClick={onNewClient}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
        >
          Add Client
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title="Search (Cmd+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--text-primary)' }}
          />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
