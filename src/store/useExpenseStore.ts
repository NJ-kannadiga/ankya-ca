import { create } from "zustand";

export const useExpenseStore = create((set) => ({
  excelData: null,
  selectedQuarter: "Q1",

  setExcelData: (data) => set({ excelData: data }),
  setSelectedQuarter: (q) => set({ selectedQuarter: q }),
}));
