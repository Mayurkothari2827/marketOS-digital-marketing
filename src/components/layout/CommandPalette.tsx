import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Users, Megaphone, Tag, Calendar, ArrowRight } from 'lucide-react';
import { Client, Campaign, Offer, CalendarEvent } from '../../types';
import { NavigationTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  campaigns: Campaign[];
  offers: Offer[];
  calendarEvents: CalendarEvent[];
  onSelectClient: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  clients,
  campaigns,
  offers,
  calendarEvents,
  onSelectClient,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedClients = clients.filter(
      (c) =>
        c.businessInfo.businessName.toLowerCase().includes(q) ||
        c.businessInfo.city.toLowerCase().includes(q) ||
        c.businessInfo.category.toLowerCase().includes(q)
    );

    const matchedCampaigns = campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.campaignType.toLowerCase().includes(q) ||
        c.coreMessage.toLowerCase().includes(q)
    );

    const matchedOffers = offers.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q) ||
        o.discountBadge.toLowerCase().includes(q)
    );

    const matchedEvents = calendarEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.festivalName && e.festivalName.toLowerCase().includes(q))
    );

    return {
      clients: matchedClients,
      campaigns: matchedCampaigns,
      offers: matchedOffers,
      events: matchedEvents,
    };
  }, [query, clients, campaigns, offers, calendarEvents]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden flex flex-col max-h-[70vh] shadow-2xl animate-fadeIn"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, campaigns, offers, festivals..."
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)' }}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            className="text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {!query.trim() ? (
            <div className="space-y-3 py-2">
              <span
                className="text-[10px] uppercase font-semibold tracking-wider px-2 block"
                style={{ color: 'var(--text-muted)' }}
              >
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tab: 'dashboard', label: 'Agency Dashboard', desc: 'Global workload & KPIs' },
                  { tab: 'strategist', label: 'AI Marketing Strategist', desc: 'Monthly themes & recommendations' },
                  { tab: 'campaigns', label: 'Campaign Machine', desc: 'One idea → entire campaign' },
                  { tab: 'creative', label: 'Creative Studio', desc: 'Canvas poster & ad generator' },
                  { tab: 'calendar', label: 'Marketing Calendar', desc: 'Indian festivals & scheduled posts' },
                  { tab: 'offers', label: 'Offer Engine', desc: 'BOGO, EMI & Exchange schemes' },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onNavigate(item.tab as NavigationTab);
                      onClose();
                    }}
                    className="flex flex-col text-left p-3 rounded-lg transition-all"
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
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Matched Clients */}
              {filteredResults && filteredResults.clients.length > 0 && (
                <div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider px-2 mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Clients ({filteredResults.clients.length})
                  </span>
                  <div className="space-y-0.5">
                    {filteredResults.clients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectClient(c.id);
                          onNavigate('clients');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs"
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {c.businessInfo.businessName[0]}
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {c.businessInfo.businessName}
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {c.businessInfo.category} • {c.businessInfo.city}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Campaigns */}
              {filteredResults && filteredResults.campaigns.length > 0 && (
                <div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider px-2 mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    Campaigns ({filteredResults.campaigns.length})
                  </span>
                  <div className="space-y-0.5">
                    {filteredResults.campaigns.map((camp) => (
                      <button
                        key={camp.id}
                        onClick={() => {
                          onSelectClient(camp.clientId);
                          onNavigate('campaigns');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{camp.name}</div>
                          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {camp.campaignType} • {camp.duration}
                          </div>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {camp.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Offers */}
              {filteredResults && filteredResults.offers.length > 0 && (
                <div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider px-2 mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Offers ({filteredResults.offers.length})
                  </span>
                  <div className="space-y-0.5">
                    {filteredResults.offers.map((off) => (
                      <button
                        key={off.id}
                        onClick={() => {
                          onSelectClient(off.clientId);
                          onNavigate('offers');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{off.title}</div>
                          <div className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {off.discountBadge}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Calendar Events */}
              {filteredResults && filteredResults.events.length > 0 && (
                <div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider px-2 mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Calendar & Festivals ({filteredResults.events.length})
                  </span>
                  <div className="space-y-0.5">
                    {filteredResults.events.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onSelectClient(ev.clientId);
                          onNavigate('calendar');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{ev.title}</div>
                          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {ev.date} • {ev.category}
                          </div>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {ev.festivalName || 'Event'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredResults &&
                filteredResults.clients.length === 0 &&
                filteredResults.campaigns.length === 0 &&
                filteredResults.offers.length === 0 &&
                filteredResults.events.length === 0 && (
                  <div className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    No results found for &ldquo;{query}&rdquo;.
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2.5 border-t flex items-center justify-between text-[11px]"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex items-center gap-3">
            <span>
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >↑↓</kbd> navigate
            </span>
            <span>
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ backgroundColor: 'var(--hover-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >↵</kbd> select
            </span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>
            MarketOS Quick Switcher
          </span>
        </div>
      </div>
    </div>
  );
};
