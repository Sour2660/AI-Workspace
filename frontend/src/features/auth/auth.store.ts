import { create } from "zustand";
import { storage } from "@/utils/storage";
import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (
    user: User,
    token: string,
    remember?: boolean,
    refreshToken?: string
  ) => void;
  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  accessToken: storage.getToken(),
  refreshToken: storage.getRefreshToken(),
  isAuthenticated: !!storage.getToken(),

  login: (user, token, remember = true, refreshToken) => {
    storage.setUser(user, remember);
    storage.setToken(token, remember);
    if (refreshToken) {
      storage.setRefreshToken(refreshToken, remember);
    }
    set((state) => ({
      user,
      token,
      accessToken: token,
      refreshToken: refreshToken ?? state.refreshToken,
      isAuthenticated: true,
    }));
  },

  setAuth: (user, accessToken, refreshToken) => {
    storage.setUser(user);
    storage.setToken(accessToken);
    storage.setRefreshToken(refreshToken);
    set({
      user,
      token: accessToken,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.clear();
    set({
      user: null,
      token: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    storage.setUser(user, storage.isRemembered());
    set({ user });
  },
}));