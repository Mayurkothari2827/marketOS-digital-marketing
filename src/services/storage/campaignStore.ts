import { Campaign, ContentItem, AssetStatus } from '../../types';

const CAMPAIGNS_STORAGE_KEY = 'marketos_campaigns';

class CampaignStore {
  private campaigns: Campaign[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasDemoCampaigns = Array.isArray(parsed) && parsed.some((c: Campaign) =>
          c.clientId?.includes('yashika') ||
          c.clientId?.includes('royal-fashion') ||
          c.clientId?.includes('bikaner-fitness') ||
          c.name?.includes('Weekend AC Exchange') ||
          c.name?.includes('Navratri')
        );

        if (hasDemoCampaigns) {
          this.campaigns = [];
          this.saveToStorage();
        } else {
          this.campaigns = parsed;
        }
      } else {
        this.campaigns = [];
        this.saveToStorage();
      }
    } catch {
      this.campaigns = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(this.campaigns));
    } catch {
      // ignore
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  getCampaigns(clientId?: string): Campaign[] {
    if (clientId) {
      return this.campaigns.filter((c) => c.clientId === clientId);
    }
    return [...this.campaigns];
  }

  getCampaign(id: string): Campaign | undefined {
    return this.campaigns.find((c) => c.id === id);
  }

  addCampaign(campaign: Campaign) {
    this.campaigns.unshift(campaign);
    this.notify();
  }

  updateCampaign(campaign: Campaign) {
    const idx = this.campaigns.findIndex((c) => c.id === campaign.id);
    if (idx !== -1) {
      this.campaigns[idx] = campaign;
      this.notify();
    }
  }

  deleteCampaign(id: string) {
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    this.notify();
  }

  updateAssetStatus(campaignId: string, assetId: string, status: AssetStatus) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (campaign && campaign.contentAssets) {
      const asset = campaign.contentAssets.find((a) => a.id === assetId);
      if (asset) {
        asset.status = status;
        this.notify();
      }
    }
  }

  addContentAsset(campaignId: string, item: ContentItem) {
    const campaign = this.campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      if (!campaign.contentAssets) campaign.contentAssets = [];
      campaign.contentAssets.unshift(item);
      campaign.contentPiecesCount = campaign.contentAssets.length;
      this.notify();
    }
  }

  clearAll() {
    this.campaigns = [];
    this.notify();
  }
}

export const campaignStore = new CampaignStore();
