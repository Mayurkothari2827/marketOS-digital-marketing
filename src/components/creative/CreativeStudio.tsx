import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Download,
  Sliders,
  Layers,
  FileDown,
  Plus,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Client, Campaign, CreativeDimension } from '../../types';
import { CreativeCanvas, CanvasCreativeConfig } from './CreativeCanvas';
import { downloadElementAsImage } from '../../services/storage/creativeExporter';

interface CreativeStudioProps {
  client: Client;
  campaigns: Campaign[];
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  client,
  campaigns,
}) => {
  const supportedDimensions: CreativeDimension[] = [
    { id: 'ig-square', label: 'Instagram / WhatsApp Post', width: 1080, height: 1080, aspectRatio: '1:1', platform: 'Instagram' },
    { id: 'ig-portrait', label: 'Instagram Portrait', width: 1080, height: 1350, aspectRatio: '4:5', platform: 'Instagram' },
    { id: 'ig-story', label: 'Story & Reel Cover', width: 1080, height: 1920, aspectRatio: '9:16', platform: 'Instagram' },
    { id: 'fb-banner', label: 'Facebook Ad Banner', width: 1200, height: 628, aspectRatio: '1.91:1', platform: 'Facebook' },
    { id: 'a4-poster', label: 'A4 Showroom Print Poster', width: 1240, height: 1754, aspectRatio: 'A4', platform: 'Print' },
  ];

  const [hasActiveCreative, setHasActiveCreative] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<CreativeDimension>(supportedDimensions[0]);

  const defaultProduct = client?.products?.[0];

  const [config, setConfig] = useState<CanvasCreativeConfig>({
    headline: defaultProduct
      ? `Special Offer on ${defaultProduct.name}`
      : `Exclusive Offer from ${client?.businessInfo?.businessName || 'Us'}`,
    subheadline: defaultProduct?.description || `High quality products and exceptional service in ${client?.businessInfo?.city || 'town'}.`,
    offerBadge: 'Special Offer',
    priceTag: defaultProduct ? `₹${defaultProduct.price.toLocaleString()}` : '',
    originalPrice: defaultProduct ? `₹${Math.round(defaultProduct.price * 1.2).toLocaleString()}` : '',
    ctaText: 'Contact Us / Visit Store',
    layoutTemplate: 'bold_urgency',
    bgGradient: `linear-gradient(135deg, ${client?.brandKit?.secondaryColor || '#1e293b'} 0%, ${client?.brandKit?.primaryColor || '#0f172a'} 50%, #020617 100%)`,
    textColor: '#ffffff',
    accentColor: client?.brandKit?.accentColor || '#f59e0b',
    selectedProductId: defaultProduct?.id,
    showLogo: true,
    showContactBar: true,
  });

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (format: 'png' | 'jpeg' | 'pdf') => {
    setDownloading(true);
    try {
      if (format === 'pdf') {
        const element = document.getElementById('marketos-creative-canvas');
        if (element) {
          const canvas = await html2canvas(element, { scale: 2 });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdf = new jsPDF({
            orientation: selectedDimension.height > selectedDimension.width ? 'p' : 'l',
            unit: 'px',
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
          pdf.save(`${(client?.businessInfo?.businessName || 'MarketOS').replace(/\s+/g, '_')}_Creative.pdf`);
        }
      } else {
        await downloadElementAsImage(
          'marketos-creative-canvas',
          `${(client?.businessInfo?.businessName || 'MarketOS').replace(/\s+/g, '_')}_Creative.${format}`,
          format
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const bgPresets = [
    { label: 'Dark Navy & Slate', val: `linear-gradient(135deg, ${client?.brandKit?.secondaryColor || '#1e293b'} 0%, ${client?.brandKit?.primaryColor || '#0f172a'} 50%, #020617 100%)` },
    { label: 'Festive Crimson & Gold', val: 'linear-gradient(135deg, #881337 0%, #9f1239 45%, #d97706 100%)' },
    { label: 'Deep Ocean & Electric Cyan', val: 'linear-gradient(135deg, #0f172a 0%, #0369a1 60%, #0284c7 100%)' },
    { label: 'Energetic Emerald & Forest', val: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #10b981 100%)' },
    { label: 'Midnight Black & Amber Glow', val: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #78350f 100%)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Creative Studio: Visual Ad Generator & Canvas
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Production-quality marketing graphics customized with real product imagery, client branding, and contact banners.
            </p>
          </div>
        </div>

        {hasActiveCreative && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('png')}
              disabled={downloading}
              className="py-2 px-3.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Rendering...' : 'Download PNG'}</span>
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
              className="py-2 px-3 rounded-xl bg-[#F7F7F7] hover:bg-[#F3F3F3] text-[#111111] text-xs font-semibold flex items-center gap-1 border border-[#E5E5E5] transition-colors"
              title="Download PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        )}
      </div>

      {!hasActiveCreative ? (
        /* Empty State */
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <Palette className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">No creatives yet.</h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            Generate production-ready marketing graphics, posters, and social ad creatives with your brand styling.
          </p>
          <button
            onClick={() => setHasActiveCreative(true)}
            className="px-5 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Creative</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Canvas Live Preview */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col items-center justify-center min-h-[500px]">
            {/* Dimension Selector Bar */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 w-full">
              {supportedDimensions.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(dim)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedDimension.id === dim.id
                      ? 'bg-[#111111] text-white shadow-sm'
                      : 'bg-white text-[#666666] hover:text-[#111111] border border-[#E5E5E5]'
                  }`}
                >
                  {dim.label} ({dim.width}x{dim.height})
                </button>
              ))}
            </div>

            {/* Canvas Render */}
            <CreativeCanvas
              client={client}
              config={config}
              dimension={selectedDimension}
              canvasId="marketos-creative-canvas"
            />

            <div className="text-[11px] text-[#999999] mt-4 text-center">
              Retina-scale canvas engine preserves transparent product cutouts, exact brand colors, and high-DPI typography.
            </div>
          </div>

          {/* Right Side: Creative Customization Controls */}
          <div className="lg:col-span-5 bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
              <Sliders className="w-4 h-4 text-[#111111]" />
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                Creative Customization
              </h3>
            </div>

            {/* Select Product */}
            {client?.products && client.products.length > 0 && (
              <div>
                <label className="block text-[#999999] font-medium mb-1">Select Featured Product</label>
                <select
                  value={config.selectedProductId}
                  onChange={(e) => {
                    const prod = client.products.find((p) => p.id === e.target.value);
                    setConfig({
                      ...config,
                      selectedProductId: e.target.value,
                      priceTag: prod ? `₹${prod.price.toLocaleString()}` : config.priceTag,
                      originalPrice: prod ? `₹${Math.round(prod.price * 1.2).toLocaleString()}` : config.originalPrice,
                      headline: prod ? `Special Offer on ${prod.name}` : config.headline,
                    });
                  }}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                >
                  {client.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Headline */}
            <div>
              <label className="block text-[#999999] font-medium mb-1">Headline Text</label>
              <input
                type="text"
                value={config.headline}
                onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-[#999999] font-medium mb-1">Subheadline / Supporting Copy</label>
              <input
                type="text"
                value={config.subheadline}
                onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Offer Badge & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#999999] font-medium mb-1">Offer Badge</label>
                <input
                  type="text"
                  value={config.offerBadge}
                  onChange={(e) => setConfig({ ...config, offerBadge: e.target.value })}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2 text-[#111111]"
                />
              </div>
              <div>
                <label className="block text-[#999999] font-medium mb-1">Price Tag</label>
                <input
                  type="text"
                  value={config.priceTag}
                  onChange={(e) => setConfig({ ...config, priceTag: e.target.value })}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2 text-[#111111] font-bold"
                />
              </div>
            </div>

            {/* CTA Text */}
            <div>
              <label className="block text-[#999999] font-medium mb-1">CTA Button Text</label>
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111]"
              />
            </div>

            {/* Background Gradient Palette */}
            <div>
              <label className="block text-[#999999] font-medium mb-1.5">Color Theme Presets</label>
              <div className="space-y-1.5">
                {bgPresets.map((bg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setConfig({ ...config, bgGradient: bg.val })}
                    className={`w-full p-2 rounded-xl text-left font-medium border flex items-center justify-between transition-colors ${
                      config.bgGradient === bg.val
                        ? 'border-[#111111] bg-white text-[#111111] font-bold'
                        : 'border-[#E5E5E5] bg-white text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    <span>{bg.label}</span>
                    <div
                      className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                      style={{ background: bg.val }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#666666]">
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => setConfig({ ...config, showLogo: e.target.checked })}
                  className="rounded border-[#E5E5E5] bg-white text-[#111111] focus:ring-[#111111]"
                />
                <span>Display Showroom Logo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#666666]">
                <input
                  type="checkbox"
                  checked={config.showContactBar}
                  onChange={(e) => setConfig({ ...config, showContactBar: e.target.checked })}
                  className="rounded border-[#E5E5E5] bg-white text-[#111111] focus:ring-[#111111]"
                />
                <span>Display Address & WhatsApp</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
