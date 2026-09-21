import { Client } from '../../types';

const CLIENTS_STORAGE_KEY = 'marketos_clients';
const ACTIVE_CLIENT_KEY = 'marketos_active_client_id';

class ClientStore {
  private clients: Client[] = [];
  private activeClientId: string | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored data contains previous demo clients, wipe it completely
        const hasDemoIds = Array.isArray(parsed) && parsed.some((c: Client) =>
          c.id.includes('yashika') ||
          c.id.includes('royal-fashion') ||
          c.id.includes('bikaner-fitness') ||
          c.id.includes('coffee-house') ||
          c.id.includes('sharma-furniture') ||
          c.businessInfo?.businessName === 'Yashika Agencies'
        );

        if (hasDemoIds) {
          this.clients = [];
          this.activeClientId = null;
          this.saveToStorage();
        } else {
          this.clients = parsed;
          const activeId = localStorage.getItem(ACTIVE_CLIENT_KEY);
          if (activeId && this.clients.some((c) => c.id === activeId)) {
            this.activeClientId = activeId;
          } else if (this.clients.length > 0) {
            this.activeClientId = this.clients[0].id;
          } else {
            this.activeClientId = null;
          }
        }
      } else {
        this.clients = [];
        this.activeClientId = null;
        this.saveToStorage();
      }
    } catch {
      this.clients = [];
      this.activeClientId = null;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(this.clients));
      if (this.activeClientId) {
        localStorage.setItem(ACTIVE_CLIENT_KEY, this.activeClientId);
      } else {
        localStorage.removeItem(ACTIVE_CLIENT_KEY);
      }
    } catch {
      // storage quota or incognito fallback
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

  getClients(): Client[] {
    return [...this.clients];
  }

  getClient(id: string): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }

  getActiveClient(): Client | null {
    if (this.activeClientId) {
      const found = this.clients.find((c) => c.id === this.activeClientId);
      if (found) return found;
    }
    return this.clients.length > 0 ? this.clients[0] : null;
  }

  setActiveClientId(id: string | null) {
    if (!id) {
      this.activeClientId = null;
      this.notify();
      return;
    }
    if (this.clients.some((c) => c.id === id)) {
      this.activeClientId = id;
      this.notify();
    }
  }

  addClient(client: Client) {
    this.clients.unshift(client);
    this.activeClientId = client.id;
    this.notify();
  }

  updateClient(updated: Client) {
    const idx = this.clients.findIndex((c) => c.id === updated.id);
    if (idx !== -1) {
      this.clients[idx] = { ...updated, updatedAt: new Date().toISOString() };
      this.notify();
    }
  }

  deleteClient(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
    if (this.activeClientId === id) {
      this.activeClientId = this.clients.length > 0 ? this.clients[0].id : null;
    }
    this.notify();
  }

  clearAll() {
    this.clients = [];
    this.activeClientId = null;
    this.notify();
  }

  resetToDemo() {
    // Deprecated: resets to empty state
    this.clearAll();
  }
}

export const clientStore = new ClientStore();
