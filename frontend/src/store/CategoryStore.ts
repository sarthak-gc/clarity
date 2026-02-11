import type { Category } from "@/types/all";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CategoryStoreI {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
}

export const useCategoryStore = create<CategoryStoreI>()(
  persist(
    (set) => ({
      categories: [] as Category[],
      setCategories: (categories: Category[]) =>
        set(() => ({ categories: [...categories] })),
      addCategory: (category: Category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (categoryId: string) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
        })),
    }),
    {
      name: "categories-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
