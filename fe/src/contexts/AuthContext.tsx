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
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL! + "/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearBookingLocalStorage = () => {
  const prefixes = ["draft_booking_form_", "pending_booking_"];

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (prefixes.some((p) => key.startsWith(p))) {
      localStorage.removeItem(key);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [access, setAccess] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh token
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

  // Fetch user profile
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

  //  Refetch profile (public)
  const refetchProfile = async () => {
    if (!access) return;
    await fetchUserProfile(access);
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/users/logout/`, {
        method: "POST",
        credentials: "include",
        headers: access ? { Authorization: `Bearer ${access}` } : {},
      });
      clearBookingLocalStorage();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccess(null);
      setUser(null);

      router.replace("/");
    }
  };

  // INIT AUTH
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
      value={{
        access,
        user,
        setAccess,
        setUser,
        logout,
        loading,
        refetchProfile,
        refreshAccessToken,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(" useAuth phải được dùng bên trong <AuthProvider>");
  return ctx;
};
