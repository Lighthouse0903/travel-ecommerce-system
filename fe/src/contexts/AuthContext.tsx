"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType } from "@/types/auth";
import { UserResponse } from "@/types/user";

const API_URL = "http://127.0.0.1:8000/api";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [access, setAccess] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // === Refresh token ===
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/users/refresh/`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.access) {
        setAccess(data.access);
        return data.access;
      }
      return null;
    } catch (err) {
      console.error("Lỗi khi refresh token:", err);
      return null;
    }
  };

  // === Fetch user profile ===
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Get profile failed");
      const data = await res.json();
      setUser(data.data ?? data);
    } catch (err) {
      console.error("Lỗi khi lấy profile:", err);
      setUser(null);
    }
  };

  // === Logout ===
  const logout = async () => {
    try {
      await fetch(`${API_URL}/users/logout/`, {
        method: "POST",
        credentials: "include",
        headers: access ? { Authorization: `Bearer ${access}` } : {},
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccess(null);
      setUser(null);
    }
  };

  // === INIT AUTH ===
  useEffect(() => {
    const initAuth = async () => {
      try {
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          await fetchUserProfile(newAccess);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Init auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ access, user, setAccess, setUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("❌ useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
};
