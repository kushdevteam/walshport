import { create } from "zustand";

interface PortfolioState {
  currentSection: string;
  isLoading: boolean;
  
  // Actions
  setCurrentSection: (section: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  currentSection: 'home',
  isLoading: true,
  
  setCurrentSection: (section) => set({ currentSection: section }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
