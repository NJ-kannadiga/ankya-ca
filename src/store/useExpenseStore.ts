import { create } from "zustand";

export const useExpenseStore = create<any>((set) => ({
  excelData: null,
  selectedQuarter: "Q4",

  setExcelData: (data: any) => set({ excelData: data }),
  setSelectedQuarter: (q: string) => set({ selectedQuarter: q }),
}));
