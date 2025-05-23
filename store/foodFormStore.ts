// stores/foodFormStore.ts
import { create } from "zustand";
import { FoodFormValues } from "../types/food"; // ou "../lib/types" selon l'option choisie

type FoodFormState = {
  data: Partial<FoodFormValues>;
  setData: (values: Partial<FoodFormValues>) => void;
  reset: () => void;
};

export const useFoodFormStore = create<FoodFormState>((set) => ({
  data: {},
  setData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ data: {} }),
}));