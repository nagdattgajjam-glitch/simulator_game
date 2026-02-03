import { create } from "zustand";
import { upgradeDefinitions } from "./upgradeData";

export type UpgradeState = {
  id: string;
  level: number;
};

export type ToastMessage = {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
};

export type GameState = {
  coins: number;
  coinsPerClick: number;
  upgrades: UpgradeState[];
  boostMultiplier: number;
  boostActiveUntil: number | null;
  lastLogin: number;
  toasts: ToastMessage[];
  clickCoffee: () => void;
  tick: (deltaSeconds: number) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  grantInstantCoins: (amount: number) => void;
  startBoost: (durationSeconds: number, multiplier: number) => void;
  applyOfflineEarnings: (offlineSeconds: number) => void;
  setLastLogin: (timestamp: number) => void;
  hydrate: (state: Partial<PersistedState>) => void;
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
};

export type PersistedState = Pick<
  GameState,
  "coins" | "coinsPerClick" | "upgrades" | "boostMultiplier" | "boostActiveUntil" | "lastLogin"
>;

const BASE_COINS_PER_CLICK = 1;
const OFFLINE_EARNINGS_CAP_SECONDS = 60 * 60 * 8;

const initialUpgrades: UpgradeState[] = upgradeDefinitions.map((upgrade) => ({
  id: upgrade.id,
  level: 0
}));

export const calculateUpgradeCost = (upgradeId: string, level: number) => {
  const definition = upgradeDefinitions.find((upgrade) => upgrade.id === upgradeId);
  if (!definition) {
    return Infinity;
  }
  return Math.floor(definition.baseCost * Math.pow(1.15, level));
};

export const calculateAutoRate = (upgrades: UpgradeState[]) => {
  return upgrades.reduce((total, upgrade) => {
    const definition = upgradeDefinitions.find((item) => item.id === upgrade.id);
    if (!definition) {
      return total;
    }
    return total + definition.rateIncrease * upgrade.level;
  }, 0);
};

export const isBoostActive = (boostActiveUntil: number | null) => {
  if (!boostActiveUntil) {
    return false;
  }
  return Date.now() < boostActiveUntil;
};

export const useGameStore = create<GameState>((set, get) => ({
  coins: 0,
  coinsPerClick: BASE_COINS_PER_CLICK,
  upgrades: initialUpgrades,
  boostMultiplier: 1,
  boostActiveUntil: null,
  lastLogin: Date.now(),
  toasts: [],
  clickCoffee: () => {
    const { coinsPerClick, boostMultiplier } = get();
    const multiplier = isBoostActive(get().boostActiveUntil) ? boostMultiplier : 1;
    set({ coins: get().coins + coinsPerClick * multiplier });
  },
  tick: (deltaSeconds) => {
    const { upgrades, boostMultiplier } = get();
    const multiplier = isBoostActive(get().boostActiveUntil) ? boostMultiplier : 1;
    const autoRate = calculateAutoRate(upgrades);
    if (autoRate <= 0) {
      return;
    }
    set({ coins: get().coins + autoRate * deltaSeconds * multiplier });
  },
  purchaseUpgrade: (upgradeId) => {
    const { upgrades, coins } = get();
    const upgrade = upgrades.find((item) => item.id === upgradeId);
    if (!upgrade) {
      return;
    }
    const cost = calculateUpgradeCost(upgradeId, upgrade.level);
    if (coins < cost) {
      get().pushToast({ type: "warning", message: "Not enough coins." });
      return;
    }
    const nextUpgrades = upgrades.map((item) =>
      item.id === upgradeId ? { ...item, level: item.level + 1 } : item
    );
    set({ coins: coins - cost, upgrades: nextUpgrades });
    get().pushToast({ type: "success", message: "Upgrade purchased!" });
  },
  grantInstantCoins: (amount) => {
    set({ coins: get().coins + amount });
  },
  startBoost: (durationSeconds, multiplier) => {
    const boostActiveUntil = Date.now() + durationSeconds * 1000;
    set({ boostActiveUntil, boostMultiplier: multiplier });
    get().pushToast({ type: "success", message: `Boost active: ${multiplier}x for ${durationSeconds}s.` });
  },
  applyOfflineEarnings: (offlineSeconds) => {
    const { upgrades } = get();
    const cappedSeconds = Math.min(offlineSeconds, OFFLINE_EARNINGS_CAP_SECONDS);
    if (cappedSeconds <= 0) {
      return;
    }
    const autoRate = calculateAutoRate(upgrades);
    if (autoRate <= 0) {
      return;
    }
    const offlineCoins = autoRate * cappedSeconds;
    set({ coins: get().coins + offlineCoins });
    get().pushToast({
      type: "info",
      message: `Earned ${offlineCoins.toFixed(1)} coins while offline.`
    });
  },
  setLastLogin: (timestamp) => set({ lastLogin: timestamp }),
  hydrate: (state) => {
    set({
      coins: state.coins ?? 0,
      coinsPerClick: state.coinsPerClick ?? BASE_COINS_PER_CLICK,
      upgrades: state.upgrades && state.upgrades.length > 0 ? state.upgrades : initialUpgrades,
      boostMultiplier: state.boostMultiplier ?? 1,
      boostActiveUntil: state.boostActiveUntil ?? null,
      lastLogin: state.lastLogin ?? Date.now()
    });
  },
  pushToast: (toast) => {
    const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { ...toast, id }] });
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
  }
}));

export const selectors = {
  upgradeCost: (upgradeId: string, level: number) => calculateUpgradeCost(upgradeId, level)
};
