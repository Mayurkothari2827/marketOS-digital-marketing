import React from 'react';
import { Phone, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BusinessInput, CampaignCreative } from '../../types/marketingPlan';

export interface PlanCreativeCanvasProps {
  business: BusinessInput;
  creative: CampaignCreative;
  dimension: 'portrait' | 'square' | 'story' | 'banner';
  canvasId: string;
}

export const PlanCreativeCanvas: React.FC<PlanCreativeCanvasProps> = ({
  business,
  creative,
  dimension,
  canvasId,
}) => {
  const isPortrait = dimension === 'portrait';
  const isStory = dimension === 'story';
  const isBanner = dimension === 'banner';
  // Default is portrait: 1080x1350, story: 1080x1920, banner: 1200x628, square: 1080x1080

  const widthPx = isStory ? 320 : isBanner ? 460 : isPortrait ? 360 : 360;
  const heightPx = isStory ? 568 : isBanner ? 240 : isPortrait ? 450 : 360;

  const productImage = creative.productImage || business.productImages?.[0] || '';
  const logoImage = business.logoUrl || '';

  return (
    <div className="flex items-center justify-center p-2 select-none overflow-hidden">
      <div
        id={canvasId}
        className="relative overflow-hidden rounded-xl flex flex-col justify-between text-white shadow-md transition-all"
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          background: creative.bgGradient,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/12 via-transparent to-black/50 pointer-events-none" />

        {/* TOP BAR: Logo & Business Branding */}
        <div className="relative z-10 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[65%]">
            {creative.showLogo && (
              logoImage ? (
                <img
                  src={logoImage}
                  alt={business.businessName}
                  className="w-7 h-7 rounded-lg object-contain bg-white/10 p-0.5 border border-white/20"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white border border-white/20 bg-white/15"
                >
                  {business.businessName?.[0] || 'M'}
                </div>
              )
            )}
            <div className="truncate">
              <div className="font-extrabold tracking-tight text-[11px] text-white uppercase drop-shadow-sm truncate">
                {business.businessName}
              </div>
              <div className="text-[9px] text-white/80 font-medium tracking-wide truncate">
                {business.location}
              </div>
            </div>
          </div>

          {/* Offer Badge Top Right */}
          {creative.offerBadge && (
            <div
              className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-slate-950 border border-white/40 shadow-sm shrink-0"
              style={{ backgroundColor: creative.accentColor || '#f59e0b' }}
            >
              {creative.offerBadge}
            </div>
          )}
        </div>

        {/* CENTER CONTENT: Headline, Product Image, Pricing */}
        <div className="relative z-10 px-3.5 flex-1 flex flex-col justify-center">
          {/* Headline & Subheadline */}
          <div className="mb-2">
            <h2 className="text-sm sm:text-base font-extrabold leading-tight tracking-tight text-white drop-shadow-sm line-clamp-2">
              {creative.headline}
            </h2>
            {creative.subheadline && (
              <p className="text-[10px] sm:text-[11px] text-white/90 font-medium mt-0.5 drop-shadow-sm line-clamp-2">
                {creative.subheadline}
              </p>
            )}
          </div>

          {/* Product Cutout & Pricing Strip */}
          <div className="flex items-center justify-between gap-2.5 my-1">
            {/* Real Product Image Showcase */}
            <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xs shrink-0 flex items-center justify-center">
              {productImage ? (
                <img
                  src={productImage}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/60 p-2 text-center">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[8px] uppercase font-semibold">
                    {business.products.split(/[,;\n]+/)[0]?.trim() || 'Verified Product'}
                  </span>
                </div>
              )}
              <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider text-white">
                Verified
              </div>
            </div>

            {/* Pricing & Value Details */}
            <div className="flex flex-col justify-center space-y-1 text-left flex-1 min-w-0">
              {creative.priceTag && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-sm truncate">
                    {creative.priceTag}
                  </span>
                  {creative.originalPrice && (
                    <span className="text-[10px] text-white/60 line-through truncate">
                      {creative.originalPrice}
                    </span>
                  )}
                </div>
              )}

              {/* Tag Pill */}
              <div
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-slate-950 w-fit shadow-xs truncate"
                style={{ backgroundColor: creative.accentColor || '#f59e0b' }}
              >
                <Sparkles className="w-2 h-2 shrink-0" />
                <span>Special Promotion</span>
              </div>

              {/* Call to action button visual */}
              {creative.ctaText && (
                <div
                  className="mt-1 px-2.5 py-1 rounded-md text-center font-extrabold text-[9px] uppercase tracking-wider text-white border border-white/30 shadow-sm truncate"
                  style={{ backgroundColor: '#111111' }}
                >
                  {creative.ctaText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Address & WhatsApp */}
        {creative.showContactBar && (business.phone || business.location) && (
          <div className="relative z-10 px-3 py-1.5 bg-black/60 backdrop-blur-xs border-t border-white/10 flex items-center justify-between text-[8px] text-white/90">
            <div className="flex items-center gap-1 truncate max-w-[55%]">
              <MapPin className="w-2.5 h-2.5 text-white/70 shrink-0" />
              <span className="truncate">{business.location}</span>
            </div>
            {business.phone && (
              <div className="flex items-center gap-1 font-bold text-white shrink-0">
                <Phone className="w-2.5 h-2.5 text-white/70 shrink-0" />
                <span>{business.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
