// src/stores/venueStore.js
import { create } from "zustand";

const useVenueStore = create((set) => ({
  allVenues: [],
  setVenues: (venues) => set({ allVenues: venues }),
}));

export default useVenueStore;
