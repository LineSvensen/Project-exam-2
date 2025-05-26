import { create } from "zustand";

const useFilterStore = create((set) => ({
  category: [],
  sort: "featured",
  search: "",
  resetAll: () =>
    set({
      category: [],
      sort: "featured",
      search: "",
    }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setSearch: (search) => set({ search }),
}));

export default useFilterStore;
