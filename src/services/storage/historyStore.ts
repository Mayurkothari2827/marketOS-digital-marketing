import { MarketingPlan } from '../../types/marketingPlan';

const STORAGE_KEY = 'marketos_marketing_plans';

class HistoryStore {
  private plans: MarketingPlan[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.plans = JSON.parse(data);
      } else {
        this.plans = [];
      }
    } catch (e) {
      console.error('Error loading marketing plans from storage', e);
      this.plans = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plans));
    } catch (e) {
      console.error('Error saving marketing plans to storage', e);
    }
  }

  getPlans(): MarketingPlan[] {
    return [...this.plans];
  }

  getPlanById(id: string): MarketingPlan | undefined {
    return this.plans.find((p) => p.id === id);
  }

  savePlan(plan: MarketingPlan): void {
    const existingIndex = this.plans.findIndex((p) => p.id === plan.id);
    if (existingIndex >= 0) {
      this.plans[existingIndex] = plan;
    } else {
      this.plans.unshift(plan);
    }
    this.saveToStorage();
  }

  deletePlan(id: string): void {
    this.plans = this.plans.filter((p) => p.id !== id);
    this.saveToStorage();
  }

  clearAll(): void {
    this.plans = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const historyStore = new HistoryStore();
