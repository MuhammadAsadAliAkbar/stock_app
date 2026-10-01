"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import {
  getMarketSummary,
  getPortfolio,
  marketTick,
  getAnalytics,
} from "@/lib/api";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  RefreshCw,
  BriefcaseBusiness,
  CircleDollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function Dashboard() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [summary, setSummary] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const load = async () => {
    try {
      const [s, p] = await Promise.all([
        getMarketSummary(),
        getPortfolio(),
      ]);

      setSummary(s.data.data);
      setPortfolio(p.data.data);

      try {
        const a = await getAnalytics();
        setAnalytics(a.data.data);
      } catch {
        // Python analytics service is optional
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const runTick = async () => {
    setTicking(true);

    try {
      await marketTick();
      toast.success("Market tick applied");
      await load();
      await refreshUser();
    } catch {
      toast.error("Start Python service for live ticks");
    } finally {
      setTicking(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
        </div>
      </div>
    );
  }

  const walletBalance =
    portfolio?.summary?.walletBalance ?? user.walletBalance ?? 0;

  const portfolioValue = portfolio?.summary?.currentValue ?? 0;
  const totalPnL = portfolio?.summary?.totalPnL ?? 0;
  const netWorth = portfolio?.summary?.netWorth ?? 0;

  const pnlPositive = totalPnL >= 0;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-auto p-5 md:p-6">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </div>

              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Trading Overview
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Welcome back,{" "}
              <span className="font-medium text-slate-300">
                {user.name}
              </span>
            </p>
          </div>

          <button
            onClick={runTick}
            disabled={ticking}
            className="btn-secondary flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:border-blue-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                ticking ? "animate-spin text-blue-400" : ""
              }`}
            />
            {ticking ? "Updating..." : "Simulate Tick"}
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Wallet */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>

              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Cash
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500">
              Wallet Balance
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-400">
              {fmt(walletBalance)}
            </p>
          </div>

          {/* Portfolio */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <BriefcaseBusiness className="h-5 w-5 text-blue-400" />
              </div>

              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Holdings
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500">
              Portfolio Value
            </p>

            <p className="mt-1 text-xl font-bold">
              {fmt(portfolioValue)}
            </p>
          </div>

          {/* P&L */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5">
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  pnlPositive
                    ? "bg-emerald-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {pnlPositive ? (
                  <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-400" />
                )}
              </div>

              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  pnlPositive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                P&L
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500">
              Total P&amp;L
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                pnlPositive ? "up" : "down"
              }`}
            >
              {fmt(totalPnL)}
            </p>
          </div>

          {/* Net Worth */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                <CircleDollarSign className="h-5 w-5 text-indigo-400" />
              </div>

              <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                Total
              </span>
            </div>

            <p className="text-xs font-medium text-slate-500">
              Net Worth
            </p>

            <p className="mt-1 text-xl font-bold text-blue-400">
              {fmt(netWorth)}
            </p>
          </div>
        </div>

        {/* Market Movers */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">

          {/* Gainers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Top Gainers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Best performing stocks
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-600">
                Today
              </span>
            </div>

            <div className="space-y-1">
              {(summary?.gainers || [])
                .slice(0, 5)
                .map((s: any) => (
                  <div
                    key={s._id || s.symbol}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-slate-800 hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      </div>

                      <span className="text-sm font-semibold">
                        {s.symbol}
                      </span>
                    </div>

                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      +{s.changePercent}%
                    </span>
                  </div>
                ))}

              {!summary?.gainers?.length && (
                <div className="rounded-xl border border-dashed border-slate-800 py-8 text-center">
                  <p className="text-sm text-slate-500">
                    Run seed &amp; refresh
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Losers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Top Losers
                  </h2>
                  <p className="text-xs text-slate-500">
                    Biggest market declines
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-600">
                Today
              </span>
            </div>

            <div className="space-y-1">
              {(summary?.losers || [])
                .slice(0, 5)
                .map((s: any) => (
                  <div
                    key={s._id || s.symbol}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-slate-800 hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                        <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                      </div>

                      <span className="text-sm font-semibold">
                        {s.symbol}
                      </span>
                    </div>

                    <span className="rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                      {s.changePercent}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Activity className="h-4 w-4 text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Market Sentiment
                </h2>
                <p className="text-xs text-slate-500">
                  Current market analytics
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">
                  Sentiment
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-400">
                  {analytics.sentiment}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">
                  Advances / Declines
                </p>
                <p className="mt-1 text-xl font-bold">
                  <span className="text-emerald-400">
                    {analytics.advances}
                  </span>
                  <span className="mx-2 text-slate-700">
                    /
                  </span>
                  <span className="text-red-400">
                    {analytics.declines}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">
                  Average Change
                </p>
                <p className="mt-1 text-xl font-bold text-slate-200">
                  {analytics.avg_change_percent}%
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Market CTA */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/70 p-5 shadow-lg shadow-black/10">

          <div>
            <p className="font-semibold">
              Explore the market
            </p>
            <p className="mt-1 text-sm text-slate-500">
              View stocks, prices and market movements.
            </p>
          </div>

          <Link
            href="/market"
            className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            View Market
            <ArrowUpRight className="h-4 w-4" />
          </Link>

        </div>

      </main>
    </div>
  );
}