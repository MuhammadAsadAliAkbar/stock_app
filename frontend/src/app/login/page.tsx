"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CandlestickChart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("trader@exchange.com");
  const [password, setPassword] = useState("trader123");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 flex items-center justify-center relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute top-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-950/30">
            <CandlestickChart className="h-7 w-7 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your trading dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">

          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="email"
                  className="input w-full pl-10 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full pl-10 pr-11 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold shadow-lg shadow-blue-950/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <p className="text-center text-xs text-slate-500">
              Demo account
            </p>

            <p className="mt-1 text-center text-xs font-medium text-slate-400">
              trader@exchange.com
              <span className="mx-1.5 text-slate-700">/</span>
              trader123
            </p>
          </div>

          {/* Register */}
          <div className="mt-5 flex items-center justify-center gap-1 text-sm">
            <span className="text-slate-500">
              Don't have an account?
            </span>

            <Link
              href="/register"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4" />
          Secure account access
        </div>
      </div>
    </div>
  );
}