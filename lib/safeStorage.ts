import type { StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export function getSafeStorage(): StateStorage {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  return window.localStorage;
}

