import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  pageTitle: '',

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
