import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  get isLoggedIn() {
    return !!this.user && !!this.token;
  },

  login: (userData, token) => {
    console.log("✅ Logging in and saving to localStorage");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, token });
  },

  logout: () => {
    console.log("👋 Logging out and clearing localStorage");
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
        if (!parsedUser?.name) throw new Error("Corrupted user data");
        set({ user: parsedUser, token: storedToken });
        console.log("✅ Rehydrated user from localStorage:", parsedUser);
      } else {
        console.warn("⚠️ No user/token found in storage");
      }
    } catch (err) {
      console.error("❌ Error loading user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
