import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SheetMapping } from '../services/googleSheetService';

interface DashboardState {
  sheetId: string;
  setSheetId: (id: string) => void;
  
  data: SheetMapping | null;
  setData: (data: SheetMapping | null) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
  
  filters: {
    projectId: string | null;
    employee: string | null;
    dateRange: [string, string] | null;
    searchQuery: string;
  };
  setFilters: (filters: Partial<DashboardState['filters']>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      sheetId: '',
      setSheetId: (id) => set({ sheetId: id }),
      
      data: null,
      setData: (data) => set({ data }),
      
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      error: null,
      setError: (error) => set({ error }),
      
      filters: {
        projectId: null,
        employee: null,
        dateRange: null,
        searchQuery: '',
      },
      setFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    }),
    {
      name: 'pm-dashboard-storage',
      partialize: (state) => ({ sheetId: state.sheetId }), // Only persist sheetId
    }
  )
);
