import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: (userData, token) => {
    console.log("✅ Storing user and token");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  loadUserFromStorage: () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser?.name) throw new Error("User corrupted");
        set({ user: parsedUser, token: storedToken });
        console.log("✅ Loaded user from storage:", parsedUser);
      } else {
        console.warn("⚠️ No user/token in storage.");
      }
    } catch (err) {
      console.error("❌ Failed to load user from storage", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
