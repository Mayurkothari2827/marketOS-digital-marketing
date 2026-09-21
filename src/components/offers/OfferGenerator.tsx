import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Client, Offer } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface OfferGeneratorProps {
  client: Client;
  onSelectOfferForCampaign: (offer: Offer) => void;
}

export const OfferGenerator: React.FC<OfferGeneratorProps> = ({
  client,
  onSelectOfferForCampaign,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<string>(
    client?.products?.[0]?.id || ''
  );
  const [offerType, setOfferType] = useState<Offer['type']>('Exchange Offer');
  const [generating, setGenerating] = useState(false);

  const offerTypes: Offer['type'][] = [
    'Exchange Offer',
    'EMI Offer',
    'Flat Discount',
    'Buy One Get One',
    'Bundle Offer',
    'Limited Time Offer',
    'Weekend Offer',
    'Festival Offer',
  ];

  const handleGenerateOffer = async () => {
    if (!client) return;
    setGenerating(true);
    try {
      const provider = aiManager.getProvider();
      const newOffer = await provider.generateOffers(client, selectedProductId, offerType);
      setOffers([newOffer, ...offers]);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Retail Offer & Promotion Generator
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Formulates high-converting, margin-protective retail offers (Exchange Schemes, No-Cost EMI, BOGO, Festive Bundles).
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
          Margin Guardrails Active
        </div>
      </div>

      {/* Offer Formulator Bar */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 text-xs text-[#666666]">
        <h3 className="text-sm font-bold text-[#111111] mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#111111]" />
          Formulate New Commercial Offer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[#999999] font-medium mb-1">Target Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
            >
              {client?.products && client.products.length > 0 ? (
                client.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price.toLocaleString()})
                  </option>
                ))
              ) : (
                <option value="">No products added yet</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[#999999] font-medium mb-1">Offer Mechanism</label>
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value as Offer['type'])}
              className="w-full bg-white border border-[#E5E5E5] rounded-xl p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
            >
              {offerTypes.map((ot) => (
                <option key={ot} value={ot}>
                  {ot}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateOffer}
              disabled={generating}
              className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
            >
              <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Calculating Formulas...' : 'Generate Retail Offer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Offers List */}
      {offers.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">No offers created.</h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            Select a target product and promotional mechanism above, then click &ldquo;Generate Retail Offer&rdquo; to formulate conversion-focused commercial offers.
          </p>
          <button
            onClick={handleGenerateOffer}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{generating ? 'Generating Offer...' : 'Create Offer'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                    {offer.type}
                  </span>
                  <span className="text-[11px] text-[#999999] font-medium">
                    Margin Health: <span className="text-[#111111] font-bold">{offer.marginHealth}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#111111] mb-1">{offer.title}</h3>
                <p className="text-xs text-[#666666] font-semibold mb-3">{offer.headline}</p>

                {/* Price & Savings Pill */}
                <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-[#999999]">Offer Pricing</div>
                    <div className="text-base font-extrabold text-[#111111]">
                      {offer.offerPrice ? `₹${offer.offerPrice.toLocaleString()}` : 'Special Bundle'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#111111] font-semibold">{offer.discountBadge}</div>
                    {offer.originalPrice && (
                      <div className="text-[11px] text-[#999999] line-through">
                        MRP ₹{offer.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgency Trigger */}
                <div className="bg-[#F7F7F7] p-2.5 rounded-lg border border-[#E5E5E5] mb-3 space-y-1">
                  <span className="text-[10px] font-bold text-[#111111] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Psychological Urgency Mechanism:
                  </span>
                  <p className="text-[#666666] text-[11px]">{offer.urgencyMechanism}</p>
                </div>

                {/* Cross-Sell */}
                {offer.crossSellIdeas && offer.crossSellIdeas.length > 0 && (
                  <div className="text-[11px] text-[#999999] space-y-1">
                    <span className="text-[#999999] font-medium">Cross-sell Opportunities:</span>
                    <ul className="list-disc list-inside text-[#666666]">
                      {offer.crossSellIdeas.map((cs, i) => (
                        <li key={i}>{cs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                <div className="text-[#111111] font-semibold text-[11px]">
                  CTA: {offer.cta}
                </div>
                <button
                  onClick={() => onSelectOfferForCampaign(offer)}
                  className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>Launch in Campaign Machine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
