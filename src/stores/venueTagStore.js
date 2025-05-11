import { create } from "zustand";

const useVenueTagStore = create((set, get) => ({
  tagsByVenueId: JSON.parse(localStorage.getItem("venueTags") || "{}"),

  setTagsForVenue: (venueId, tags) => {
    const updated = { ...get().tagsByVenueId, [venueId]: tags };
    localStorage.setItem("venueTags", JSON.stringify(updated));
    set({ tagsByVenueId: updated });
  },

  getTagsForVenue: (venueId) => {
    return get().tagsByVenueId[venueId] || [];
  },
}));

export default useVenueTagStore;
