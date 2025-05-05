import { create } from "zustand";

const useFavouritesStore = create((set) => ({
  favourites: [],
  addFavourite: (venue) =>
    set((state) => {
      const updated = [...state.favourites, venue];
      localStorage.setItem("favourites", JSON.stringify(updated));
      return { favourites: updated };
    }),
  removeFavourite: (id) =>
    set((state) => {
      const updated = state.favourites.filter((venue) => venue.id !== id);
      localStorage.setItem("favourites", JSON.stringify(updated));
      return { favourites: updated };
    }),
  loadFavourites: async () => {
    const stored = JSON.parse(localStorage.getItem("favourites")) || [];
    const fetched = await Promise.all(
      stored.map(async (venue) => {
        if (typeof venue === "object") return venue;
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${venue}`
        );
        const json = await res.json();
        return json.data;
      })
    );
    set({ favourites: fetched });
  },
}));

export default useFavouritesStore;
