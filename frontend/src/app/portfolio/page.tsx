"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { getPortfolio } from "@/lib/api";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  Wallet,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getPortfolio()
        .then((r) => setData(r.data.data))
        .catch(console.error);
    }
  }, [user]);

  if (loading || !user) return null;

  const s = data?.summary;
  const totalPnL = s?.totalPnL || 0;
  const isProfit = totalPnL >= 0;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-400">
                <BriefcaseBusiness className="h-4 w-4" />
                Investments
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Portfolio
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Track your holdings, portfolio value and overall performance.
              </p>
            </div>

            <Link
              href="/trade"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-400 transition hover:bg-blue-500/15"
            >
              <TrendingUp className="h-4 w-4" />
              Trade Stocks
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Invested */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/5 transition hover:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <span className="rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Invested
                </span>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total Invested
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {fmt(s?.totalInvested)}
              </p>
            </div>

            {/* Current Value */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/5 transition hover:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <span className="rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Holdings
                </span>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Current Value
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {fmt(s?.currentValue)}
              </p>
            </div>

            {/* P&L */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/5 transition hover:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isProfit
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isProfit ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                    isProfit
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  P&L
                </span>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total P&L
              </p>

              <p
                className={`mt-1 text-xl font-bold ${
                  isProfit ? "up" : "down"
                }`}
              >
                {fmt(totalPnL)}
              </p>

              <p
                className={`mt-1 text-xs ${
                  isProfit ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isProfit ? "+" : ""}
                {s?.totalPnLPercent || 0}% overall
              </p>
            </div>

            {/* Wallet */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/5 transition hover:border-slate-700">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                  Available
                </span>
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Wallet Balance
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-400">
                {fmt(s?.walletBalance)}
              </p>
            </div>
          </div>

          {/* Holdings */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
            {/* Table Header */}
            <div className="flex flex-col gap-2 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </div>

                  <h2 className="font-semibold text-white">
                    Your Holdings
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Current positions and performance
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-500">
                {data?.holdings?.length || 0} positions
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/30 text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5">Symbol</th>
                    <th className="px-4 py-3.5 text-right">Qty</th>
                    <th className="px-4 py-3.5 text-right">Avg Buy</th>
                    <th className="px-4 py-3.5 text-right">LTP</th>
                    <th className="px-4 py-3.5 text-right">Invested</th>
                    <th className="px-4 py-3.5 text-right">Value</th>
                    <th className="px-4 py-3.5 text-right">P&L</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {(data?.holdings || []).map((h: any) => {
                    const holdingProfit = h.pnl >= 0;

                    return (
                      <tr
                        key={h._id}
                        className="border-b border-slate-800/60 transition hover:bg-slate-800/25"
                      >
                        {/* Symbol */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                holdingProfit
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {holdingProfit ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-blue-400">
                                {h.stock?.symbol}
                              </p>

                              <p className="text-[11px] text-slate-600">
                                Position
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-4 py-4 text-right font-medium text-slate-300">
                          {h.quantity}
                        </td>

                        {/* Avg Buy */}
                        <td className="px-4 py-4 text-right text-slate-400">
                          ₨{h.avgBuyPrice?.toFixed(2)}
                        </td>

                        {/* LTP */}
                        <td className="px-4 py-4 text-right font-medium text-white">
                          ₨{h.stock?.currentPrice?.toFixed(2)}
                        </td>

                        {/* Invested */}
                        <td className="px-4 py-4 text-right text-slate-400">
                          {fmt(h.invested)}
                        </td>

                        {/* Value */}
                        <td className="px-4 py-4 text-right font-medium text-slate-200">
                          {fmt(h.currentValue)}
                        </td>

                        {/* P&L */}
                        <td className="px-4 py-4 text-right">
                          <div
                            className={`inline-flex flex-col items-end ${
                              holdingProfit ? "up" : "down"
                            }`}
                          >
                            <span className="font-semibold">
                              {fmt(h.pnl)}
                            </span>

                            <span className="text-[11px]">
                              {holdingProfit ? "+" : ""}
                              {h.pnlPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Trade */}
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/trade?symbol=${h.stock?.symbol}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition hover:border-blue-500/30 hover:bg-blue-500/15"
                          >
                            Trade
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {(!data?.holdings || data.holdings.length === 0) && (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>

                <h3 className="font-semibold text-slate-300">
                  No holdings yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Your purchased stocks will appear here once you
                  place your first order.
                </p>

                <Link
                  href="/trade"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  <TrendingUp className="h-4 w-4" />
                  Place a Buy Order
                </Link>
              </div>
            )}
          </div>

          {/* Bottom Portfolio Insight */}
          {data?.holdings?.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-xs text-slate-500">
              <CircleDollarSign className="h-4 w-4 text-blue-400" />
              Portfolio value updates according to the latest market prices.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}