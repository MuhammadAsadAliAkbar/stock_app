"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CandlestickChart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Min 6 characters");
    }

    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">

      {/* Subtle background glow */}
      <div className="absolute left-1/2 top-[-140px] h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-[-160px] left-[-100px] h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Brand / Heading */}
        <div className="mb-6 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-950/30">
            <CandlestickChart className="h-7 w-7 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Open Account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Start your virtual trading journey
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">

          {/* Welcome Bonus */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Gift className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Welcome Bonus
              </p>
              <p className="text-sm font-semibold text-emerald-400">
                ₨100,000 virtual cash
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  className="input w-full pl-10 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
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

              <p className="mt-1.5 text-xs text-slate-600">
                Use at least 6 characters for your password.
              </p>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-5 flex items-center justify-center gap-1 text-sm">
            <span className="text-slate-500">
              Already have an account?
            </span>

            <Link
              href="/login"
              className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4" />
          Secure account registration
        </div>
      </div>
    </div>
  );
}