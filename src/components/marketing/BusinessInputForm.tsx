import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { StudioArtwork } from './StudioArtwork';
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
    <div className="studio-page">
      <section className="studio-hero">
        <div className="hero-copy">
          <div className="studio-eyebrow"><span /> YOUR BUSINESS. A NEW PERSPECTIVE.</div>
          <h1>Good businesses<br />deserve <em>bold</em><br /><span className="hero-last">marketing.<svg viewBox="0 0 360 20" aria-hidden="true"><path d="M3 13Q160 -5 350 9M20 19Q175 6 325 17" /></svg></span></h1>
          <p>You bring the ambition. We bring the ideas.<br />Turn what makes your business special into<br className="desktop-break" /> marketing that feels unmistakably <em>you.</em></p>
          <a className="hero-cta" href="#business-brief">Let’s make something great <ArrowRight size={18} /></a>
          <div className="hero-note"><span className="hand-star">✳</span> A whole marketing department. One creative spark.</div>
        </div>
        <StudioArtwork />
      </section>
      <div className="studio-ribbon"><span>SMALL BUSINESS. BIG IDEAS.</span><span>✳</span><span>STRATEGY WITH SOUL</span><span>✳</span><span>CONTENT WITH CHARACTER</span><span>✳</span><span>MADE TO STAND OUT</span></div>
      <section className="brief-layout" id="business-brief">
        <aside className="brief-intro">
          <span className="studio-eyebrow">01 / THE CREATIVE BRIEF</span>
          <h2>Every great idea<br /> starts with<br /> <em>your story.</em></h2>
          <p>A few details. A fresh canvas.<br />Tell us what you do, and we’ll connect the dots.</p>
          <div className="deliverable-list">
            <div><span>01</span><p><strong>A direction that’s yours</strong>Positioning & marketing strategy</p></div>
            <div><span>02</span><p><strong>Ideas worth talking about</strong>Six tailored campaign concepts</p></div>
            <div><span>03</span><p><strong>Ready for the real world</strong>Social copy, reels & visual creatives</p></div>
          </div>
          <div className="brief-stamp">A little AI.<br /><em>A lot of possibility.</em><span>↗</span></div>
        </aside>
      {/* Main Input Form Card */}
      <form
        onSubmit={handleSubmit}
        className="creative-form space-y-6"
      >
        <div className="pb-3 border-b border-[#E5E5E5]">
          <h2 className="text-base font-bold text-[#111111] tracking-tight">
            Let’s meet your business.
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Start with the essentials. The best ideas begin with a little context.
          </p>
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-xs font-semibold text-[#111111] mb-1.5">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="businessName"
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
            <label htmlFor="category" className="block text-xs font-semibold text-[#111111] mb-1.5">
              Business Category <span className="text-red-500">*</span>
            </label>
            <select
            id="category"
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
            <label htmlFor="location" className="block text-xs font-semibold text-[#111111] mb-1.5">
              Location (City, State) <span className="text-red-500">*</span>
            </label>
            <input
            id="location"
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
          <label htmlFor="products" className="block text-xs font-semibold text-[#111111] mb-1.5">
            What does the business sell? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="products"
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
          <label htmlFor="usp" className="block text-xs font-semibold text-[#111111] mb-1.5">
            What makes this business special? (USP) <span className="text-xs font-normal text-[#999999]">(Optional)</span>
          </label>
          <input
            id="usp"
            type="text"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            placeholder="e.g. Authorized dealers, same-day installation, No-cost EMI & exchange."
            className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
          />
        </div>

        {/* Current Offers */}
        <div>
          <label htmlFor="offers" className="block text-xs font-semibold text-[#111111] mb-1.5">
            Current Offers or Promotions <span className="text-xs font-normal text-[#999999]">(Optional)</span>
          </label>
          <input
            id="offers"
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
            <label htmlFor="targetCustomers" className="block text-xs font-semibold text-[#111111]">
              Target Customers <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <span className="text-[10px] text-[#666666] flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> If left blank, AI infers automatically
            </span>
          </div>
          <input
            id="targetCustomers"
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
            <label htmlFor="phone" className="block text-xs font-semibold text-[#111111] mb-1.5">
              WhatsApp / Phone Number <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <input
            id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98220 12345"
              className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-xs font-semibold text-[#111111] mb-1.5">
              Website / Social Link <span className="text-xs font-normal text-[#999999]">(Optional)</span>
            </label>
            <input
            id="website"
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
                <span>Create my marketing plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-[#999999] text-center mt-2">
            Builds strategy, 6 campaign ideas, Instagram/WhatsApp/Reel copy, and high-res visual creatives in seconds.
          </p>
        </div>
      </form>
      </section>
    </div>
  );
};
