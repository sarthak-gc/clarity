// src/store/hooks/useAuthStore.ts
import { useAuthStore } from "../AuthStore";

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};
