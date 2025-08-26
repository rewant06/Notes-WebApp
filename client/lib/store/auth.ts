import { create } from "zustand";
import { api, ensureCsrf } from "@/lib/api";

type User = { id: string; email: string; name: string } | null;
type State = {
  user: User;
  loading: boolean;
  error: string | null;
  fetchMe: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = create<State>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      await ensureCsrf();
      const res = await api.get("/auth/me");
      set({ user: res.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    await ensureCsrf();
    try {
      await api.post("/auth/login", { email, password });
      await (useAuth.getState().fetchMe());
    } catch (e: any) {
      set({ error: e?.response?.data?.error || "Login failed" });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (username, email, password) => {
    set({ loading: true, error: null });
    await ensureCsrf();
    try {
      await api.post("/auth/signup", { username, email, password });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await ensureCsrf();
    await api.post("/auth/logout");
    set({ user: null });
  }
}));