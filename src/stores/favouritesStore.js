import { create } from "zustand";
import useAuthStore from "./authStore"; // Ensure the path is correct

const useFavouritesStore = create((set, get) => ({
  favourites: [],

  addFavourite: (venue) => {
    const { user } = useAuthStore.getState();
    if (!user?.name) return;

    const updated = [...get().favourites, venue];
    localStorage.setItem(`favourites_${user.name}`, JSON.stringify(updated));
    set({ favourites: updated });
  },

  removeFavourite: (id) => {
    const { user } = useAuthStore.getState();
    if (!user?.name) return;

    const updated = get().favourites.filter((venue) => venue.id !== id);
    localStorage.setItem(`favourites_${user.name}`, JSON.stringify(updated));
    set({ favourites: updated });
  },

  loadFavourites: () => {
    const { user } = useAuthStore.getState();
    if (!user?.name) return;

    const stored =
      JSON.parse(localStorage.getItem(`favourites_${user.name}`)) || [];
    set({ favourites: stored });
  },
}));

export default useFavouritesStore;
