"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister, getMe } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  _id: string; name: string; email: string; role: string; walletBalance: number;
}
interface AuthCtx {
  user: User | null; loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (n: string, e: string, p: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const r = await getMe();
      setUser(r.data.data);
      localStorage.setItem("user", JSON.stringify(r.data.data));
    } catch { /* ignore */ }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setUser(JSON.parse(u));
      getMe().then((r) => { setUser(r.data.data); localStorage.setItem("user", JSON.stringify(r.data.data)); })
        .catch(() => { localStorage.clear(); setUser(null); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const r = await apiLogin({ email, password });
    const { token, ...u } = r.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    toast.success("Logged in!");
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    const r = await apiRegister({ name, email, password });
    const { token, ...u } = r.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    toast.success("Account created! ₨100,000 credited.");
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
