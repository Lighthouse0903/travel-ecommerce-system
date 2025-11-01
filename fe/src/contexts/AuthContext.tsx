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
  const [loading, setLoading] = useState(true); // ✅ thêm state loading

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

  // === Lấy profile ===
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Get profile failed");

      const data = await res.json();
      setUser(data.data ?? data); // ✅ phòng trường hợp BE trả {data:{...}}
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

  // === INIT AUTH khi F5 ===
  useEffect(() => {
    const initAuth = async () => {
      const newAccess = await refreshAccessToken();
      if (newAccess) await fetchUserProfile(newAccess);
      setLoading(false); // ✅ rất quan trọng: chỉ render children sau khi xong
    };
    initAuth();
  }, []);

  // ✅ Không render children cho tới khi auth khởi tạo xong
  if (loading) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ access, user, setAccess, setUser, logout, loading }}
    >
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
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
