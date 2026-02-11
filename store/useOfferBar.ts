import { create } from "zustand";

interface OfferBarState {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export const useOfferBar = create<OfferBarState>((set) => ({
  visible: true,
  setVisible: (v) => set({ visible: v }),
}));
