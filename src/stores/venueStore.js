import { create } from "zustand";
import { persist } from "zustand/middleware";

const useVenueStore = create(
  persist(
    (set) => ({
      allVenues: [],
      setVenues: (venues) => set({ allVenues: venues }),
    }),
    {
      name: "holidaze-venues",
    }
  )
);

export default useVenueStore;
