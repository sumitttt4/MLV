import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CustomerProfile } from "@/types/schema";
import { getCurrentUser } from "@/lib/api";

interface AuthState {
  user: CustomerProfile | null;
  isLoading: boolean;
  setUser: (user: CustomerProfile | null) => void;
  clearUser: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const profile = await getCurrentUser();
          set({ user: profile });
        } catch {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "mlv-auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
