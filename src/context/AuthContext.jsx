"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

const Ctx = createContext(null);

const extract = (res) => {
  const d = res?.data;
  // Handle: { success, data: { user, accessToken } } OR { data: { user } }
  return d?.data ?? d ?? {};
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    if (!Cookies.get("accessToken")) { setLoading(false); return; }
    try {
      const res = await authAPI.getMe();
      const d = extract(res);
      setUser(d.user ?? d);
    } catch {
      Cookies.remove("accessToken"); Cookies.remove("refreshToken");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const setTokens = (at, rt) => {
    Cookies.set("accessToken", at, { expires: 7, sameSite: "lax" });
    if (rt) Cookies.set("refreshToken", rt, { expires: 30, sameSite: "lax" });
  };

  const redirectByRole = (role) => {
    const map = { candidate: "/candidate/dashboard", hr: "/hr/dashboard", mentor: "/mentor/dashboard", admin: "/admin/dashboard" };
    router.push(map[role] || "/");
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const d = extract(res);
    if (!d.accessToken) throw new Error("No access token — check .env JWT_SECRET");
    setTokens(d.accessToken, d.refreshToken);
    const u = d.user ?? d;
    setUser(u);
    toast.success(`Welcome back, ${u?.name?.split(" ")[0] || ""}! 👋`);
    redirectByRole(u?.role);
    return u;
  };

  const register = async (form) => {
    const res = await authAPI.register(form);
    const d = extract(res);
    if (!d.accessToken) throw new Error("Registration failed — no token");
    setTokens(d.accessToken, d.refreshToken);
    const u = d.user ?? d;
    setUser(u);
    toast.success("Account created! Verify your email. 🎉");
    redirectByRole(u?.role);
    return u;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    Cookies.remove("accessToken"); Cookies.remove("refreshToken");
    setUser(null);
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <Ctx.Provider value={{ user, setUser, loading, login, register, logout, fetchMe }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};
