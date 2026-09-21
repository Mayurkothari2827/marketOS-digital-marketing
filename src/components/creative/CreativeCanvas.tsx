import React from 'react';
import { Sparkles, Phone, MapPin, Image as ImageIcon } from 'lucide-react';
import { Client, CreativeDimension } from '../../types';

export interface CanvasCreativeConfig {
  headline: string;
  subheadline: string;
  offerBadge: string;
  priceTag: string;
  originalPrice: string;
  ctaText: string;
  layoutTemplate: 'festive_burst' | 'minimal_product' | 'bold_urgency' | 'lifestyle_story' | 'review_quote';
  bgGradient: string;
  textColor: string;
  accentColor: string;
  selectedProductId?: string;
  customProductImage?: string;
  showLogo: boolean;
  showContactBar: boolean;
}

interface CreativeCanvasProps {
  client: Client;
  config: CanvasCreativeConfig;
  dimension: CreativeDimension;
  canvasId: string;
}

export const CreativeCanvas: React.FC<CreativeCanvasProps> = ({
  client,
  config,
  dimension,
  canvasId,
}) => {
  const selectedProduct =
    client?.products?.find((p) => p.id === config.selectedProductId) ||
    client?.products?.[0];

  const productImage = config.customProductImage || selectedProduct?.imageUrl || '';

  // Aspect ratio calculation
  const isStory = dimension.height > dimension.width;
  const isFb = dimension.width === 1200;

  return (
    <div className="flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Actual Rendered Creative Canvas */}
      <div
        id={canvasId}
        className="relative overflow-hidden rounded-xl flex flex-col justify-between text-white transition-all shadow-lg"
        style={{
          width: isStory ? '340px' : isFb ? '480px' : '380px',
          height: isStory ? '600px' : isFb ? '250px' : '380px',
          background: config.bgGradient,
          fontFamily: client?.brandKit?.fontHeading || 'Plus Jakarta Sans',
        }}
      >
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

        {/* TOP BAR: Logo & Business Branding */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.showLogo && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white border border-white/20"
                style={{ backgroundColor: client?.brandKit?.primaryColor || '#111111' }}
              >
                {client?.businessInfo?.businessName?.[0] || 'M'}
              </div>
            )}
            <div>
              <div className="font-extrabold tracking-tight text-xs text-white uppercase drop-shadow-sm">
                {client?.businessInfo?.businessName || 'Business Name'}
              </div>
              <div className="text-[9px] text-white/80 font-medium tracking-wide">
                {client?.businessInfo?.city || ''}
                {client?.businessInfo?.category ? ` • ${client.businessInfo.category}` : ''}
              </div>
            </div>
          </div>

          {/* Offer Badge Top Right */}
          {config.offerBadge && (
            <div
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-950 border border-white/40 shadow-sm"
              style={{ backgroundColor: config.accentColor || '#f59e0b' }}
            >
              {config.offerBadge}
            </div>
          )}
        </div>

        {/* CENTER CONTENT: Headline, Product Image, Pricing */}
        <div className="relative z-10 px-4 flex-1 flex flex-col justify-center">
          {/* Headline & Subheadline */}
          <div className="mb-2">
            <h2 className="text-base font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
              {config.headline}
            </h2>
            {config.subheadline && (
              <p className="text-[11px] text-white/90 font-medium mt-0.5 drop-shadow-sm">
                {config.subheadline}
              </p>
            )}
          </div>

          {/* Product Cutout & Pricing Strip */}
          <div className="flex items-center justify-between gap-3 my-1">
            {/* Real Product Image Showcase */}
            <div className="relative w-32 h-28 sm:w-36 sm:h-32 rounded-xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xs shrink-0 flex items-center justify-center">
              {productImage ? (
                <img
                  src={productImage}
                  alt={selectedProduct?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/60 p-2 text-center">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[9px] uppercase font-semibold">
                    {selectedProduct?.name || 'Featured Product'}
                  </span>
                </div>
              )}
              {selectedProduct?.name && (
                <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white">
                  Verified
                </div>
              )}
            </div>

            {/* Pricing & Value Details */}
            <div className="flex flex-col justify-center space-y-1 text-left flex-1">
              {selectedProduct?.name && (
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                  {selectedProduct.name}
                </div>
              )}

              {config.priceTag && (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                    {config.priceTag}
                  </span>
                  {config.originalPrice && (
                    <span className="text-xs text-white/60 line-through">
                      {config.originalPrice}
                    </span>
                  )}
                </div>
              )}

              {/* Tag Pill */}
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold text-slate-950 w-fit shadow-sm"
                style={{ backgroundColor: config.accentColor || '#f59e0b' }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Verified Quality</span>
              </div>

              {/* Call to action button visual */}
              {config.ctaText && (
                <div
                  className="mt-1 px-3 py-1.5 rounded-lg text-center font-black text-[10px] uppercase tracking-wider text-white border border-white/30 shadow-sm"
                  style={{ backgroundColor: client?.brandKit?.primaryColor || '#111111' }}
                >
                  {config.ctaText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Showroom Address & WhatsApp Channel */}
        {config.showContactBar && (client?.businessInfo?.address || client?.businessInfo?.whatsapp) && (
          <div className="relative z-10 px-4 py-2 bg-black/60 backdrop-blur-xs border-t border-white/10 flex items-center justify-between text-[9px] text-white/90">
            {client?.businessInfo?.address && (
              <div className="flex items-center gap-1 truncate max-w-[55%]">
                <MapPin className="w-3 h-3 text-white/70 shrink-0" />
                <span className="truncate">{client.businessInfo.address}</span>
              </div>
            )}
            {client?.businessInfo?.whatsapp && (
              <div className="flex items-center gap-1 font-bold text-white shrink-0">
                <Phone className="w-3 h-3 text-white/70 shrink-0" />
                <span>{client.businessInfo.whatsapp}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
