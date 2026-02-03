import { PersistedState } from "../store/gameStore";

const STORAGE_KEY = "idle-coffee-sim";

export const loadState = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PersistedState;
  } catch (error) {
    console.error("Failed to load saved game", error);
    return null;
  }
};

export const saveState = (state: PersistedState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game", error);
  }
};
