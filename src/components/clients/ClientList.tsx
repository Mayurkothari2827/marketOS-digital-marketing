import React, { useState } from 'react';
import {
  Plus,
  Search,
  ArrowRight,
  MapPin,
  Package,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Users,
} from 'lucide-react';
import { Client } from '../../types';

interface ClientListProps {
  clients: Client[];
  activeClient: Client | null;
  onSelectClient: (id: string) => void;
  onOpenProfile: (client: Client) => void;
  onNewClient: () => void;
  onDeleteClient: (id: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  activeClient,
  onSelectClient,
  onOpenProfile,
  onNewClient,
  onDeleteClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(clients.map((c) => c.businessInfo.category)))];

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.businessInfo.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessInfo.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.businessInfo.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Client Accounts
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {clients.length}
            </span>
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Agency client roster with localized business profiles and AI Business Brains.
          </p>
        </div>

        <button
          onClick={onNewClient}
          className="py-2 px-4 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all self-start sm:self-auto"
          style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Client</span>
        </button>
      </div>

      {clients.length === 0 ? (
        /* Requirement 1: Empty state when no clients exist */
        <div
          className="rounded-xl p-12 text-center max-w-md mx-auto my-8 animate-fadeIn"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <Users className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-base font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            No clients yet
          </h3>
          <p className="text-xs mt-1 mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Onboard your first local business client to generate marketing strategies and multi-channel campaigns.
          </p>
          <button
            onClick={onNewClient}
            className="py-2.5 px-5 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-all shadow-sm"
            style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Client</span>
          </button>
        </div>
      ) : (
        <>
          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, or category..."
                className="w-full rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: categoryFilter === cat ? 'var(--btn-primary-bg)' : 'var(--bg)',
                    color: categoryFilter === cat ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
                    border: categoryFilter === cat ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Client Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => {
              const isSelected = activeClient ? client.id === activeClient.id : false;
              const contentTarget = client.deliverablesTarget?.contentPerMonth || 20;
              const contentDone = client.deliverablesDone?.publishedThisMonth || 0;
              const contentPercent = Math.min(100, Math.round((contentDone / contentTarget) * 100));

              return (
                <div
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className="rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg)',
                    border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white text-sm shrink-0"
                          style={{ backgroundColor: client.brandKit?.primaryColor || 'var(--btn-primary-bg)' }}
                        >
                          {client.businessInfo.businessName[0] || 'C'}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {client.businessInfo.businessName}
                          </h3>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <MapPin className="w-3 h-3" />
                            {client.businessInfo.city}{client.businessInfo.state ? `, ${client.businessInfo.state}` : ''}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: client.status === 'On Track' ? 'var(--success)' : 'var(--warning)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {client.status}
                      </span>
                    </div>

                    {/* Description */}
                    {client.businessInfo.description && (
                      <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {client.businessInfo.description}
                      </p>
                    )}

                    {/* Metrics */}
                    <div
                      className="grid grid-cols-2 gap-2 p-3 rounded-lg mb-4 text-xs"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      <div>
                        <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Products</div>
                        <div className="font-semibold mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                          <Package className="w-3.5 h-3.5" />
                          {client.products.length} Items
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Language</div>
                        <div className="font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                          {client.marketingGoals?.preferredLanguage || 'English'}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 mb-4 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span style={{ color: 'var(--text-muted)' }}>Monthly Deliverables</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{contentPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${contentPercent}%`, backgroundColor: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProfile(client);
                      }}
                      className="font-medium flex items-center gap-1 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span>Edit Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove ${client.businessInfo.businessName}?`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      className="p-1.5 transition-colors hover:text-red-500"
                      style={{ color: 'var(--text-muted)' }}
                      title="Delete client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
