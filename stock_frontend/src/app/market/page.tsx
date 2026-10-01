"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { getStocks } from "@/lib/api";
import Link from "next/link";
import {
  Search,
  BarChart3,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

const fmt = (n: number) =>
  n?.toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  }) ?? "—";

export default function MarketPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const params: any = {};

    if (search) params.search = search;
    if (sector) params.sector = sector;

    getStocks(params)
      .then((r) => setStocks(r.data.data))
      .catch(console.error);
  }, [search, sector]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  const sectors: string[] = Array.from(
  new Set(
    stocks
      .map((s) => s.sector)
      .filter(Boolean)
  )
);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-auto p-5 md:p-6">

        {/* Header */}
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Market Watch
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Track market prices and discover trading opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
              <Activity className="h-4 w-4 text-emerald-400" />

              <span className="text-xs font-medium text-slate-400">
                {stocks.length} {stocks.length === 1 ? "Stock" : "Stocks"}
              </span>
            </div>

          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/10">

          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Market Filters
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                className="input w-full rounded-xl pl-10 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Search symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sector */}
            <select
              className="input w-full rounded-xl transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:w-48"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">All Sectors</option>

              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Market Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">

              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">

                  <th className="px-5 py-4">
                    Symbol
                  </th>

                  <th className="px-5 py-4">
                    Name
                  </th>

                  <th className="px-5 py-4">
                    Sector
                  </th>

                  <th className="px-5 py-4 text-right">
                    Price
                  </th>

                  <th className="px-5 py-4 text-right">
                    Change
                  </th>

                  <th className="px-5 py-4 text-right">
                    %
                  </th>

                  <th className="px-5 py-4 text-right">
                    Volume
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {stocks.map((s) => {
                  const positive = s.change >= 0;

                  return (
                    <tr
                      key={s._id}
                      className="group border-b border-slate-800/60 transition-colors hover:bg-slate-800/30"
                    >

                      {/* Symbol */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              positive
                                ? "bg-emerald-500/10"
                                : "bg-red-500/10"
                            }`}
                          >
                            {positive ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-400" />
                            )}
                          </div>

                          <span className="font-bold text-blue-400">
                            {s.symbol}
                          </span>

                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-300">
                          {s.name}
                        </span>
                      </td>

                      {/* Sector */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                          {s.sector}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-semibold text-slate-200">
                          {fmt(s.currentPrice)}
                        </span>
                      </td>

                      {/* Change */}
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`font-semibold ${
                            positive ? "up" : "down"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {fmt(s.change)}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex min-w-[65px] justify-center rounded-lg px-2 py-1 text-xs font-semibold ${
                            positive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {s.changePercent}%
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="px-5 py-4 text-right">
                        <span className="text-slate-400">
                          {(s.volume / 1000).toFixed(0)}K
                        </span>
                      </td>

                      {/* Trade */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/trade?symbol=${s.symbol}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-950/20 transition-all hover:bg-blue-500 hover:shadow-md"
                        >
                          Trade
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

          {/* Empty State */}
          {stocks.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
                <BarChart3 className="h-5 w-5 text-slate-500" />
              </div>

              <h3 className="font-semibold text-slate-300">
                No stocks found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Run the backend seed or adjust your search filters.
              </p>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}