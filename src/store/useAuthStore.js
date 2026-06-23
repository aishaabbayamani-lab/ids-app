import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  sidebarOpen: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  clearAuth: () => set({ user: null, profile: null }),
}));
