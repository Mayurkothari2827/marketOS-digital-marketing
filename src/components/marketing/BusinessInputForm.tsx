import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { BusinessInput } from '../../types/marketingPlan';

interface BusinessInputFormProps {
  onGenerate: (input: BusinessInput) => void;
  isGenerating: boolean;
}

const POPULAR_CATEGORIES = [
  'Electronics & Home Appliances',
  'Fashion & Apparel',
  'Jewelry & Bridal Boutique',
  'Gym, Fitness & Yoga',
  'Cafe, Bakery & Restaurant',
  'Furniture & Home Decor',
  'Automotive & Bike Dealership',
  'Salon, Spa & Beauty',
  'Clinic, Dental & Healthcare',
  'Real Estate & Interior Design',
  'Coaching & Education',
  'Other / Custom Category',
];

export const BusinessInputForm: React.FC<BusinessInputFormProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(POPULAR_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [location, setLocation] = useState('');
  const [products, setProducts] = useState('');
  const [usp, setUsp] = useState('');
  const [offers, setOffers] = useState('');
  const [targetCustomers, setTargetCustomers] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [logoUrl, setLogoUrl] = useState<string>('');
  const [productImages, setProductImages] = useState<string[]>([]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProductImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !location.trim() || !products.trim()) return;

    const finalCategory = category === 'Other / Custom Category' && customCategory.trim()
      ? customCategory.trim()
      : category;

    onGenerate({
      businessName: businessName.trim(),
      category: finalCategory,
      location: location.trim(),
      products: products.trim(),
      usp: usp.trim() || undefined,
      offers: offers.trim() || undefined,
      targetCustomers: targetCustomers.trim() || undefined,
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
      logoUrl: logoUrl || undefined,
      productImages: productImages.length > 0 ? productImages : undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      {/* Editorial Monochrome Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5] mb-3">
          <Sparkles className="w-3 h-3 text-[#111111]" />
          AI Digital Marketing Department
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] mb-2">
          MarketOS
        </h1>
        <p className="text-base sm:text-lg font-medium text-[#111111]">
          AI Marketing for Local Businesses
        </p>
        <p className="text-xs sm:text-sm text-[#666666] mt-1 italic">
          &ldquo;Give us the business. We&apos;ll build the marketing.&rdquo;
        </p>
      </div>

      {/* Main Input Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="pb-3 border-b border-[#E5E5E5]">
          <h2 className="text-base font-bold text-[#111111] tracking-tight">
            Tell us about the business
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Fill in the essential details. MarketOS autonomously determines positioning, content angles, campaigns, and creatives.
          </p>
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Apex Electronics, Metro Cafe, Royal Boutique..."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Business Category & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              Business Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
            >
              {POPULAR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {category === 'Other / Custom Category' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type your category..."
                className="mt-2 w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              Location (City, State) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bikaner, Rajasthan or Pune, MH"
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
            />
          </div>
        </div>

        {/* What does the business sell? */}
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            What does the business sell? <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            placeholder="e.g. ACs, refrigerators, washing machines, TVs, and other consumer home appliances."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-3 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors leading-relaxed"
          />
        </div>

        {/* USP / Special */}
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            What makes this business special? (USP) <span className="text-xs font-normal text-[#999999]">(Optional)</span>
          </label>
          <input
            type="text"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            placeholder="e.g. Authorized dealers, same-day installation, No-cost EMI & exchange."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Current Offers */}
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Current Offers or Promotions <span className="text-xs font-normal text-[#999999]">(Optional)</span>
          </label>
          <input
            type="text"
            value={offers}
            onChange={(e) => setOffers(e.target.value)}
            placeholder="e.g. Up to ₹10,000 exchange bonus on selected models."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Target Customers */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#111111]">
              Target Customers <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <span className="text-[10px] text-[#666666] flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> If left blank, AI infers automatically
            </span>
          </div>
          <input
            type="text"
            value={targetCustomers}
            onChange={(e) => setTargetCustomers(e.target.value)}
            placeholder="e.g. Families, homeowners, and value-conscious shoppers in town."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Contact & Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              WhatsApp / Phone Number <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98220 12345"
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              Website / Social Link <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="instagram.com/storename"
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        {/* Media Uploads (Logo & Product Photos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E5]">
          {/* Upload Logo */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              Upload Business Logo <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="relative w-12 h-12 rounded-xl border border-[#E5E5E5] p-1 bg-white flex items-center justify-center shrink-0">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px]"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : null}
              <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#D4D4D4] hover:border-[#111111] cursor-pointer text-xs text-[#666666] hover:text-[#111111] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Logo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Product Images */}
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1.5">
              Upload Product Photos <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#D4D4D4] hover:border-[#111111] cursor-pointer text-xs text-[#666666] hover:text-[#111111] transition-colors">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Add Photos for Creatives</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImageUpload}
                className="hidden"
              />
            </label>

            {productImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {productImages.map((img, i) => (
                  <div key={i} className="relative w-10 h-10 rounded-lg border border-[#E5E5E5] overflow-hidden">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeProductImage(i)}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#111111]/80 text-white flex items-center justify-center text-[9px]"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary Submit Button (One Action) */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isGenerating || !businessName.trim() || !location.trim() || !products.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>AI is Building Complete Marketing Solution...</span>
              </>
            ) : (
              <>
                <span>Generate Marketing Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-[#999999] text-center mt-2">
            Builds strategy, 6 campaign ideas, Instagram/WhatsApp/Reel copy, and high-res visual creatives in seconds.
          </p>
        </div>
      </form>
    </div>
  );
};
