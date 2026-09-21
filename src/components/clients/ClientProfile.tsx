import React, { useState } from 'react';
import {
  Store,
  Package,
  Users,
  Palette,
  Target,
  Brain,
  Plus,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { Client, Product } from '../../types';

interface ClientProfileProps {
  client: Client;
  onUpdateClient: (updated: Client) => void;
  onBack: () => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
  client,
  onUpdateClient,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'business' | 'products' | 'audience' | 'brand' | 'goals' | 'memory'>('business');
  const [savedMessage, setSavedMessage] = useState(false);

  // Local editing state
  const [currentClient, setCurrentClient] = useState<Client>(client);

  const handleSave = () => {
    onUpdateClient(currentClient);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleToggleStock = (prodId: string) => {
    const updated = currentClient.products.map((p) =>
      p.id === prodId ? { ...p, inStock: !p.inStock } : p
    );
    setCurrentClient({ ...currentClient, products: updated });
  };

  const handleToggleFeatured = (prodId: string) => {
    const updated = currentClient.products.map((p) =>
      p.id === prodId ? { ...p, featured: !p.featured } : p
    );
    setCurrentClient({ ...currentClient, products: updated });
  };

  const handleAddProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: 'New Product',
      category: currentClient.businessInfo.category || 'Retail',
      description: 'Product description and specifications',
      price: 1999,
      discountPercent: 10,
      features: ['Genuine Warranty', 'Express Delivery'],
      brands: [currentClient.businessInfo.businessName],
      inStock: true,
      featured: false,
    };
    setCurrentClient({
      ...currentClient,
      products: [...currentClient.products, newProd],
    });
  };

  const handleDeleteProduct = (id: string) => {
    setCurrentClient({
      ...currentClient,
      products: currentClient.products.filter((p) => p.id !== id),
    });
  };

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Store },
    { id: 'products', label: `Products (${currentClient.products.length})`, icon: Package },
    { id: 'audience', label: 'Target Audience', icon: Users },
    { id: 'brand', label: 'Brand Identity', icon: Palette },
    { id: 'goals', label: 'Marketing Goals', icon: Target },
    { id: 'memory', label: 'AI Business Brain & Memory', icon: Brain },
  ] as const;

  const hasMemoryItems =
    currentClient.memory?.successfulContent?.length > 0 ||
    currentClient.memory?.failedContent?.length > 0 ||
    currentClient.memory?.brandPreferences?.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-[#E5E5E5]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-xs text-[#666666] hover:text-[#111111] px-2.5 py-1.5 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] transition-colors border border-[#E5E5E5]"
          >
            ← Back to Clients
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
              {currentClient.businessInfo.businessName}
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                {currentClient.businessInfo.city}
              </span>
            </h2>
            <p className="text-xs text-[#666666]">
              {currentClient.businessInfo.category} • {currentClient.marketingGoals.preferredLanguage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> Changes Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-[#E5E5E5] pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-xs text-[#666666]">
        {activeTab === 'business' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] mb-2">Showroom & Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">Business Name</label>
                <input
                  type="text"
                  value={currentClient.businessInfo.businessName}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, businessName: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">Sub-Category</label>
                <input
                  type="text"
                  value={currentClient.businessInfo.subCategory}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, subCategory: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">City</label>
                <input
                  type="text"
                  value={currentClient.businessInfo.city}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, city: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">WhatsApp Number</label>
                <input
                  type="text"
                  value={currentClient.businessInfo.whatsapp}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#999999] mb-1 font-medium">Physical Address</label>
                <input
                  type="text"
                  value={currentClient.businessInfo.address}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, address: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#999999] mb-1 font-medium">Business Description</label>
                <textarea
                  rows={3}
                  value={currentClient.businessInfo.description}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      businessInfo: { ...currentClient.businessInfo, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111111]">Product Catalog</h3>
                <p className="text-[#666666]">Manage products, pricing, stock availability, and featured flags.</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            {currentClient.products.length === 0 ? (
              <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-10 text-center flex flex-col items-center justify-center">
                <Package className="w-8 h-8 text-[#999999] mb-2" />
                <div className="font-semibold text-[#111111] mb-1">No products yet</div>
                <p className="text-xs text-[#666666] max-w-sm mb-4">
                  Add products with pricing and features to generate product-specific marketing campaigns.
                </p>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentClient.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#111111]">{prod.name}</h4>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-[#999999] hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#666666] mt-1">{prod.description}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-base font-bold text-[#111111]">
                          ₹{prod.price.toLocaleString()}
                        </span>
                        {prod.discountPercent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5]">
                            {prod.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {prod.features && prod.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {prod.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5]"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleToggleStock(prod.id)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium border bg-[#F7F7F7] text-[#111111] border-[#E5E5E5]"
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(prod.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                          prod.featured
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F7F7F7] text-[#666666] border-[#E5E5E5]'
                        }`}
                      >
                        {prod.featured ? 'Featured Hero' : 'Standard'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] mb-2">Target Customer Personas</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">Primary Customer</label>
                <input
                  type="text"
                  value={currentClient.audience.primaryCustomer}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      audience: { ...currentClient.audience, primaryCustomer: e.target.value },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">Age Bracket</label>
                  <input
                    type="text"
                    value={currentClient.audience.ageRange}
                    onChange={(e) =>
                      setCurrentClient({
                        ...currentClient,
                        audience: { ...currentClient.audience, ageRange: e.target.value },
                      })
                    }
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[#999999] mb-1 font-medium">Income Segment</label>
                  <input
                    type="text"
                    value={currentClient.audience.incomeSegment}
                    onChange={(e) =>
                      setCurrentClient({
                        ...currentClient,
                        audience: { ...currentClient.audience, incomeSegment: e.target.value },
                      })
                    }
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">Customer Pain Points</label>
                <div className="space-y-1.5">
                  {currentClient.audience.problems.length > 0 ? (
                    currentClient.audience.problems.map((prob, i) => (
                      <div key={i} className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-[#111111]">
                        • {prob}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#999999] italic p-2">No pain points listed yet.</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">Buying Motivations</label>
                <div className="space-y-1.5">
                  {currentClient.audience.buyingMotivations.length > 0 ? (
                    currentClient.audience.buyingMotivations.map((mot, i) => (
                      <div key={i} className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-[#111111]">
                        ✓ {mot}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#999999] italic p-2">No buying motivations listed yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] mb-2">Brand Identity & Visual Tone</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg border border-black/10"
                  style={{ backgroundColor: currentClient.brandKit.primaryColor }}
                />
                <div>
                  <div className="text-[10px] text-[#999999]">Primary Color</div>
                  <div className="font-mono text-xs text-[#111111]">{currentClient.brandKit.primaryColor}</div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg border border-black/10"
                  style={{ backgroundColor: currentClient.brandKit.secondaryColor }}
                />
                <div>
                  <div className="text-[10px] text-[#999999]">Secondary Color</div>
                  <div className="font-mono text-xs text-[#111111]">{currentClient.brandKit.secondaryColor}</div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg border border-black/10"
                  style={{ backgroundColor: currentClient.brandKit.accentColor }}
                />
                <div>
                  <div className="text-[10px] text-[#999999]">Accent Color</div>
                  <div className="font-mono text-xs text-[#111111]">{currentClient.brandKit.accentColor}</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#999999] mb-1 font-medium">Tagline</label>
              <input
                type="text"
                value={currentClient.brandKit.tagline}
                onChange={(e) =>
                  setCurrentClient({
                    ...currentClient,
                    brandKit: { ...currentClient.brandKit, tagline: e.target.value },
                  })
                }
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] mb-2">Marketing Goals & Language</h3>
            <div>
              <label className="block text-[#999999] mb-1 font-medium">Main Business Objective</label>
              <input
                type="text"
                value={currentClient.marketingGoals.mainObjective}
                onChange={(e) =>
                  setCurrentClient({
                    ...currentClient,
                    marketingGoals: { ...currentClient.marketingGoals, mainObjective: e.target.value },
                  })
                }
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#999999] mb-1 font-medium">Monthly Marketing Budget (₹)</label>
                <input
                  type="number"
                  value={currentClient.marketingGoals.monthlyBudget}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      marketingGoals: {
                        ...currentClient.marketingGoals,
                        monthlyBudget: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#999999] mb-1 font-medium">Preferred Copy Language</label>
                <select
                  value={currentClient.marketingGoals.preferredLanguage}
                  onChange={(e) =>
                    setCurrentClient({
                      ...currentClient,
                      marketingGoals: {
                        ...currentClient.marketingGoals,
                        preferredLanguage: e.target.value as 'English' | 'Hindi' | 'Hinglish',
                      },
                    })
                  }
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="Hinglish">Hinglish</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#999999] mb-1 font-medium">Current Active Offers</label>
              <div className="space-y-1.5">
                {currentClient.marketingGoals.currentOffers.length > 0 ? (
                  currentClient.marketingGoals.currentOffers.map((off, i) => (
                    <div key={i} className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-[#666666] font-medium">
                      🏷️ {off}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#999999] italic p-2">No active offers specified.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#111111]" />
                Persistent AI Business Brain & Memory
              </h3>
              <p className="text-[#666666] mt-1">
                The AI automatically references these successes, failed experiments, and client preferences during every campaign generation.
              </p>
            </div>

            {!hasMemoryItems ? (
              <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <Brain className="w-8 h-8 text-[#999999] mb-2" />
                <div className="font-semibold text-[#111111] mb-1">No marketing history yet.</div>
                <p className="text-xs text-[#666666] max-w-sm">
                  AI memory will automatically learn and record high-performing campaign angles, customer insights, and audience response as you execute campaigns.
                </p>
              </div>
            ) : (
              <>
                {/* Successful Content */}
                {currentClient.memory.successfulContent.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] block">
                      ✓ Proven High-Performing Content (What Works)
                    </span>
                    {currentClient.memory.successfulContent.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-1"
                      >
                        <div className="font-semibold text-[#111111]">{item.theme}</div>
                        <div className="text-[#666666]">Why: {item.reason}</div>
                        <div className="text-[#111111] font-medium">Metric: {item.metric}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Failed Content */}
                {currentClient.memory.failedContent.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] block">
                      ✗ Deprecated Content Experiments (What To Avoid)
                    </span>
                    {currentClient.memory.failedContent.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] space-y-1"
                      >
                        <div className="font-semibold text-[#111111]">{item.theme}</div>
                        <div className="text-[#666666]">Reason: {item.reason}</div>
                        <div className="text-[#666666] font-medium">Learning: {item.learning}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Brand Preferences */}
                {currentClient.memory.brandPreferences.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] block">
                      Brand Guardrails & Preferences
                    </span>
                    {currentClient.memory.brandPreferences.map((pref, idx) => (
                      <div key={idx} className="p-2.5 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] text-[#666666]">
                        🔒 {pref}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
