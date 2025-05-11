// src/stores/filterStore.js
import { create } from "zustand";

const useFilterStore = create((set) => ({
  category: [],
  sort: "",
  search: "",
  resetAll: () =>
    set({
      category: [],
      sort: "",
      search: "",
    }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
}));

export default useFilterStore;
