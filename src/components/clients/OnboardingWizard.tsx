import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Package,
  Users,
  Palette,
  Tag,
  Share2,
  Target,
  Plus,
  Trash2,
} from 'lucide-react';
import { Client, Product } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const [step, setStep] = useState(1);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [initialReport, setInitialReport] = useState<string | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Retail & Shopping');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');

  // Products
  const [products, setProducts] = useState<Partial<Product>[]>([
    {
      id: 'p-1',
      name: '',
      price: 0,
      discountPercent: 0,
      features: [],
      inStock: true,
      featured: true,
    },
  ]);

  // Audience
  const [primaryCustomer, setPrimaryCustomer] = useState('');
  const [ageRange, setAgeRange] = useState('25-50');
  const [incomeSegment, setIncomeSegment] = useState('Middle to Upper-Middle');
  const [problems, setProblems] = useState('');
  const [buyingMotivations, setBuyingMotivations] = useState('');

  // Brand
  const [primaryColor, setPrimaryColor] = useState('#111111');
  const [secondaryColor, setSecondaryColor] = useState('#666666');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [tagline, setTagline] = useState('');
  const [brandTone, setBrandTone] = useState<'friendly' | 'premium' | 'energetic' | 'professional' | 'local'>('friendly');

  // Offers
  const [currentOffers, setCurrentOffers] = useState('');

  // Social & Goals
  const [instagram, setInstagram] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('Hinglish');
  const [monthlyBudget, setMonthlyBudget] = useState(25000);
  const [mainObjective, setMainObjective] = useState('Drive store footfalls and WhatsApp inquiries');

  if (!isOpen) return null;

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: `p-${Date.now()}`,
        name: '',
        price: 0,
        discountPercent: 10,
        features: ['Quality Guaranteed'],
        inStock: true,
        featured: false,
      },
    ]);
  };

  const handleUpdateProduct = (index: number, field: string, value: unknown) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setGeneratingReport(true);

    const newClient: Client = {
      id: `client-${Date.now()}`,
      businessInfo: {
        businessName: businessName || 'My Local Business',
        category: category || 'Retail',
        subCategory: subCategory || 'General',
        description: description || '',
        address: address || '',
        city: city || 'Local City',
        state: state || '',
        country: 'India',
        website,
        instagram,
        whatsapp: whatsapp || phone || '',
        phone: phone || whatsapp || '',
        email: '',
      },
      products: products
        .filter((p) => p.name && p.name.trim())
        .map((p, idx) => ({
          id: p.id || `prod-${idx}`,
          name: p.name!,
          category,
          description: p.description || `${p.name}`,
          price: Number(p.price) || 0,
          discountPercent: Number(p.discountPercent) || 0,
          features: p.features || [],
          brands: [businessName],
          inStock: p.inStock ?? true,
          featured: p.featured ?? (idx === 0),
        })),
      services: [],
      audience: {
        primaryCustomer: primaryCustomer || `Customers in ${city || 'local area'}`,
        ageRange,
        gender: 'All',
        location: city || '',
        incomeSegment,
        interests: ['Shopping', 'Local Deals'],
        problems: problems ? problems.split(',').map((s) => s.trim()).filter(Boolean) : [],
        buyingMotivations: buyingMotivations ? buyingMotivations.split(',').map((s) => s.trim()).filter(Boolean) : [],
      },
      brandKit: {
        primaryColor,
        secondaryColor,
        accentColor,
        fontHeading: 'Plus Jakarta Sans',
        fontBody: 'Plus Jakarta Sans',
        brandTone,
        tagline: tagline || '',
        brandDescription: description || '',
        visualStyle: 'Clean modern commercial layout.',
        contactInfo: {
          phone,
          whatsapp,
          address,
          city,
          website,
        },
      },
      marketingGoals: {
        mainObjective,
        monthlyBudget,
        platforms: ['Instagram', 'WhatsApp', 'Facebook', 'Google Business Profile'],
        currentOffers: currentOffers ? currentOffers.split(',').map((o) => o.trim()).filter(Boolean) : [],
        previousCampaigns: [],
        competitors: [],
        importantDates: [],
        preferredLanguage,
      },
      memory: {
        successfulContent: [],
        failedContent: [],
        customerInsights: [],
        campaignHistory: [],
        brandPreferences: [],
      },
      deliverablesTarget: {
        contentPerMonth: 20,
        creativesPerMonth: 12,
        campaignsPerMonth: 4,
      },
      deliverablesDone: {
        contentThisMonth: 0,
        creativesThisMonth: 0,
        campaignsThisMonth: 0,
        publishedThisMonth: 0,
      },
      status: 'On Track',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Confetti explosion
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    try {
      const provider = aiManager.getProvider();
      const strategy = await provider.generateStrategy(newClient);
      const summaryText = `### Initial AI Marketing Blueprint for ${newClient.businessInfo.businessName}

**Positioning:** ${strategy.businessAnalysis.positioning}

**Target Audience:** ${strategy.businessAnalysis.targetAudienceMatrix}

**Immediate Campaign Recommendations:**
1. **${strategy.recommendations[0]?.title}**: ${strategy.recommendations[0]?.why} (CTA: ${strategy.recommendations[0]?.cta})
2. **${strategy.recommendations[1]?.title}**: ${strategy.recommendations[1]?.why}
3. **${strategy.recommendations[2]?.title}**: ${strategy.recommendations[2]?.why}

Your marketing engine is fully initialized and calibrated with this client's unique Business Brain!`;

      setInitialReport(summaryText);
    } catch {
      setInitialReport(`Marketing engine initialized successfully for ${newClient.businessInfo.businessName}! You can now generate full campaigns and visual creatives.`);
    } finally {
      setGeneratingReport(false);
      onClientCreated(newClient);
    }
  };

  const steps = [
    { num: 1, title: 'Business', icon: Store },
    { num: 2, title: 'Products', icon: Package },
    { num: 3, title: 'Audience', icon: Users },
    { num: 4, title: 'Brand', icon: Palette },
    { num: 5, title: 'Offers', icon: Tag },
    { num: 6, title: 'Channels', icon: Share2 },
    { num: 7, title: 'Goals', icon: Target },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/85  animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#F7F7F7] border border-[#E5E5E5]/90 rounded-xl  overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Header */}
        <div className="p-5 border-b border-[#E5E5E5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center text-[#111111]   shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111] tracking-tight">
                Client Onboarding Wizard
              </h2>
              <p className="text-xs text-[#999999]">
                Step {step} of 7: {steps[step - 1]?.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#999999] hover:text-[#111111] hover:bg-[#F7F7F7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 border-b border-[#E5E5E5] bg-white flex items-center justify-between">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-[#111111] text-[#111111]'
                      : isCurrent
                      ? 'bg-[#111111] text-[#111111] ring-2 ring-[#111111]/20'
                      : 'bg-[#F7F7F7] text-[#999999]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-xs hidden sm:inline font-medium ${
                    isCurrent ? 'text-[#111111]' : 'text-[#999999]'
                  }`}
                >
                  {s.title}
                </span>
                {s.num < 7 && <div className="w-4 h-px bg-[#F7F7F7] hidden md:block" />}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 1: Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Metro Electronics or Royal Apparel"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Business Category *</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Jewellery, Electronics, Apparel, Salon"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Jaipur, Bengaluru"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#666666] font-medium mb-1">Showroom / Store Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 12, Station Road, Near Clock Tower"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                />
              </div>

              <div>
                <label className="block text-[#666666] font-medium mb-1">Short Business Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the AI what makes this business special, years in business, authorized dealerships..."
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111] focus:outline-none focus:border-[#D4D4D4]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111111]">Step 2: Products & Offerings</h3>
                  <p className="text-[#999999]">Add the client&apos;s main products so the AI can generate accurate promotional copy and creatives.</p>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="py-1 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-[#111111] text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Product
                </button>
              </div>

              <div className="space-y-3">
                {products.map((prod, idx) => (
                  <div key={prod.id || idx} className="p-3 bg-white rounded-xl border border-[#E5E5E5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111111]">Product #{idx + 1}</span>
                      {products.length > 1 && (
                        <button
                          onClick={() => handleRemoveProduct(idx)}
                          className="text-[#999999] hover:text-[#111111]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Product Name (e.g. 1.5 Ton Split AC)"
                        value={prod.name}
                        onChange={(e) => handleUpdateProduct(idx, 'name', e.target.value)}
                        className="sm:col-span-2 bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg p-2 text-[#111111]"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={prod.price || ''}
                        onChange={(e) => handleUpdateProduct(idx, 'price', e.target.value)}
                        className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg p-2 text-[#111111]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 3: Target Audience & Pain Points</h3>
              <div>
                <label className="block text-[#666666] font-medium mb-1">Primary Customer Profile</label>
                <input
                  type="text"
                  value={primaryCustomer}
                  onChange={(e) => setPrimaryCustomer(e.target.value)}
                  placeholder="e.g. Local homeowners and families seeking trusted service"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Age Range</label>
                  <input
                    type="text"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    placeholder="25-50"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Income Segment</label>
                  <input
                    type="text"
                    value={incomeSegment}
                    onChange={(e) => setIncomeSegment(e.target.value)}
                    placeholder="Middle to Upper-Middle"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#666666] font-medium mb-1">Customer Pain Points (comma-separated)</label>
                <textarea
                  rows={2}
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  placeholder="e.g. Delayed service, impersonal delivery, unclear pricing"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 4: Brand Identity & Colors</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-xs text-[#666666]">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-xs text-[#666666]">{secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-xs text-[#666666]">{accentColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#666666] font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Your Trusted Local Destination Since 2015"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[#666666] font-medium mb-1">Brand Tone</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['friendly', 'premium', 'energetic', 'professional', 'local'] as const).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setBrandTone(tone)}
                      className={`p-2 rounded-lg border text-xs capitalize transition-all ${
                        brandTone === tone
                          ? 'bg-[#111111] border-[#111111] text-white font-bold'
                          : 'bg-white border-[#E5E5E5] text-[#999999] hover:text-[#111111]'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 5: Active Offers & Retail Hooks</h3>
              <div>
                <label className="block text-[#666666] font-medium mb-1">Current Active Offers (comma-separated)</label>
                <textarea
                  rows={3}
                  value={currentOffers}
                  onChange={(e) => setCurrentOffers(e.target.value)}
                  placeholder="e.g. Flat 15% Launch Offer, Complimentary Consultation, Free Doorstep Delivery"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                />
                <p className="text-[11px] text-[#999999] mt-1">
                  The AI will automatically incorporate these exact offers into headlines, captions, and visual creative badges.
                </p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 6: Social Media & Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@brand_official"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://brand.com"
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-[#111111]">Step 7: Marketing Goals & Language</h3>
              <div>
                <label className="block text-[#666666] font-medium mb-1">Primary Objective</label>
                <input
                  type="text"
                  value={mainObjective}
                  onChange={(e) => setMainObjective(e.target.value)}
                  placeholder="Drive showroom walk-ins and WhatsApp inquiries"
                  className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Preferred Copy Language</label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as 'English' | 'Hindi' | 'Hinglish')}
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  >
                    <option value="Hinglish">Hinglish (Natural blend, best for retail)</option>
                    <option value="Hindi">Pure Hindi (High traditional trust)</option>
                    <option value="English">English (Modern / Tier 1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#666666] font-medium mb-1">Monthly Budget (₹)</label>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-full bg-white border border-[#E5E5E5] rounded-lg p-2.5 text-[#111111]"
                  />
                </div>
              </div>

              {initialReport && (
                <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] whitespace-pre-line leading-relaxed">
                  {initialReport}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-[#E5E5E5] bg-white/80 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="py-2 px-4 rounded-lg bg-[#F7F7F7] hover:bg-[#F3F3F3] disabled:opacity-30 text-[#111111] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="py-2 px-5 rounded-lg bg-[#111111] hover:bg-[#222222] text-[#111111] text-xs font-semibold flex items-center gap-1.5 transition-all "
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={generatingReport}
              onClick={handleComplete}
              className="py-2 px-6 rounded-lg bg-[#111111]  text-[#111111] text-xs font-bold flex items-center gap-2 transition-all  "
            >
              <Sparkles className="w-4 h-4" />
              <span>{generatingReport ? 'Calibrating AI Business Brain...' : 'Launch Marketing Engine!'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
