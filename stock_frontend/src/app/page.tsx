"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  CandlestickChart,
  TrendingUp,
  Wallet,
  Shield,
  ArrowRight,
  Activity,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5">
            <CandlestickChart className="h-5 w-5" />
          </div>

          <div>
            <p className="text-base font-bold tracking-wide text-white">
              StockEx
            </p>
            <p className="text-[9px] font-medium uppercase tracking-widest text-slate-600">
              Virtual Exchange
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-400"
          >
            Start Trading
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-6 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3.5 py-1.5 text-xs font-medium text-slate-400 shadow-lg shadow-black/10">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Learn. Trade. Track.
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Trade Stocks.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Learn the Market.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Virtual stock exchange with real-time price simulation,
            portfolio tracking, and order management. Start with
            <span className="font-semibold text-slate-200">
              {" "}
              ₨100,000 virtual cash.
            </span>
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/10 transition hover:bg-blue-400 hover:shadow-blue-500/20"
            >
              Open Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900/60 px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/70"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Line */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Shield className="h-3.5 w-3.5" />
            Paper trading — no real money required
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3">
          {/* Live Market */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>

              <Activity className="h-4 w-4 text-slate-700 transition group-hover:text-emerald-400" />
            </div>

            <h3 className="font-semibold text-white">
              Live Market
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              12+ stocks with simulated live ticks powered by
              Python.
            </p>
          </div>

          {/* Portfolio */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Wallet className="h-5 w-5" />
              </div>

              <Activity className="h-4 w-4 text-slate-700 transition group-hover:text-blue-400" />
            </div>

            <h3 className="font-semibold text-white">
              Portfolio
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Track holdings, P&amp;L, and net worth in real
              time.
            </p>
          </div>

          {/* Safe Practice */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Shield className="h-5 w-5" />
              </div>

              <Activity className="h-4 w-4 text-slate-700 transition group-hover:text-purple-400" />
            </div>

            <h3 className="font-semibold text-white">
              Safe Practice
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Paper trading environment with no real money at
              risk.
            </p>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 divide-x divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/40 py-5">
          <div className="text-center">
            <p className="text-lg font-bold text-white">12+</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
              Stocks
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-white">₨100K</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
              Virtual Cash
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-white">100%</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
              Practice
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}