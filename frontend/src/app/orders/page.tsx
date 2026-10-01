"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { getMyOrders, getTrades } from "@/lib/api";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  ReceiptText,
  XCircle,
} from "lucide-react";

const fmt = (n: number) =>
  n?.toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  }) ?? "—";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [tab, setTab] = useState<"orders" | "trades">("orders");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getMyOrders()
        .then((r) => setOrders(r.data.data))
        .catch(console.error);

      getTrades()
        .then((r) => setTrades(r.data.data))
        .catch(console.error);
    }
  }, [user]);

  if (loading || !user) return null;

  const activeRecords = tab === "orders" ? orders : trades;

  const getStatusIcon = (status: string) => {
    const value = status?.toUpperCase();

    if (
      value === "FILLED" ||
      value === "COMPLETED" ||
      value === "EXECUTED"
    ) {
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    }

    if (value === "CANCELLED" || value === "REJECTED") {
      return <XCircle className="h-3.5 w-3.5" />;
    }

    return <Clock3 className="h-3.5 w-3.5" />;
  };

  const getStatusClass = (status: string) => {
    const value = status?.toUpperCase();

    if (
      value === "FILLED" ||
      value === "COMPLETED" ||
      value === "EXECUTED"
    ) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (value === "CANCELLED" || value === "REJECTED") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-400">
                <History className="h-4 w-4" />
                Activity
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Orders & Trades
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Review your orders and completed trading activity.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-400">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              {activeRecords.length}{" "}
              {tab === "orders" ? "orders" : "trades"}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-5 flex w-fit items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/70 p-1.5">
            <button
              onClick={() => setTab("orders")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                tab === "orders"
                  ? "bg-blue-500/10 text-blue-400 shadow-sm ring-1 ring-blue-500/20"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <FileText className="h-4 w-4" />
              Orders
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab === "orders"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setTab("trades")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                tab === "trades"
                  ? "bg-blue-500/10 text-blue-400 shadow-sm ring-1 ring-blue-500/20"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <ReceiptText className="h-4 w-4" />
              Trade History
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  tab === "trades"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {trades.length}
              </span>
            </button>
          </div>

          {/* Table Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  {tab === "orders" ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <ReceiptText className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {tab === "orders"
                      ? "Order History"
                      : "Trade History"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    {tab === "orders"
                      ? "All submitted orders"
                      : "Executed trading activity"}
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-500">
                {activeRecords.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              {tab === "orders" ? (
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/30 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3.5">Time</th>
                      <th className="px-4 py-3.5">Symbol</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5 text-right">
                        Qty
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        Price
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        Amount
                      </th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o) => {
                      const isBuy = o.type === "BUY";

                      return (
                        <tr
                          key={o._id}
                          className="border-b border-slate-800/60 transition hover:bg-slate-800/25"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5 text-slate-600" />
                              {new Date(
                                o.createdAt
                              ).toLocaleString()}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-bold text-blue-400">
                              {o.stock?.symbol}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isBuy
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isBuy ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              )}
                              {o.type}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right font-medium text-slate-300">
                            {o.quantity}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-300">
                            ₨{fmt(o.price)}
                          </td>

                          <td className="px-4 py-4 text-right font-medium text-white">
                            ₨{fmt(o.totalAmount)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                                o.status
                              )}`}
                            >
                              {getStatusIcon(o.status)}
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/30 text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3.5">Time</th>
                      <th className="px-4 py-3.5">Symbol</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5 text-right">
                        Qty
                      </th>
                      <th className="px-4 py-3.5 text-right">
                        Price
                      </th>
                      <th className="px-5 py-3.5 text-right">
                        Fees
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {trades.map((t) => {
                      const isBuy = t.type === "BUY";

                      return (
                        <tr
                          key={t._id}
                          className="border-b border-slate-800/60 transition hover:bg-slate-800/25"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5 text-slate-600" />
                              {new Date(
                                t.createdAt
                              ).toLocaleString()}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-bold text-blue-400">
                              {t.stock?.symbol}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isBuy
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isBuy ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              )}
                              {t.type}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right font-medium text-slate-300">
                            {t.quantity}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-300">
                            ₨{fmt(t.price)}
                          </td>

                          <td className="px-5 py-4 text-right text-slate-400">
                            ₨{fmt(t.fees)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Empty State */}
            {activeRecords.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
                  {tab === "orders" ? (
                    <FileText className="h-6 w-6" />
                  ) : (
                    <ReceiptText className="h-6 w-6" />
                  )}
                </div>

                <h3 className="font-semibold text-slate-300">
                  No records yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {tab === "orders"
                    ? "Your submitted orders will appear here."
                    : "Your executed trades will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}