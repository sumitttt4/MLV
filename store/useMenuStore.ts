import { create } from "zustand";

export type DietaryMode = "ALL" | "VEG" | "NON_VEG";

interface MenuStoreState {
  dietaryMode: DietaryMode;
  setDietaryMode: (mode: DietaryMode) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  dietaryMode: "ALL",
  setDietaryMode: (mode) => set({ dietaryMode: mode }),
}));
