"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { getStocks, placeOrder } from "@/lib/api";
import toast from "react-hot-toast";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

function TradeForm() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stocks, setStocks] = useState<any[]>([]);
  const [stockId, setStockId] = useState("");
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState("10");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    getStocks()
      .then((r) => {
        setStocks(r.data.data);

        const sym = searchParams.get("symbol");

        if (sym) {
          const found = r.data.data.find(
            (s: any) => s.symbol === sym
          );

          if (found) {
            setStockId(found._id);
          }
        } else if (r.data.data[0]) {
          setStockId(r.data.data[0]._id);
        }
      })
      .catch(console.error);
  }, [searchParams]);

  const selected = stocks.find((s) => s._id === stockId);

  const quantity = parseInt(qty) || 0;

  const total = selected
    ? selected.currentPrice * quantity
    : 0;

  const fee = total * 0.001;

  const grandTotal = total + fee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockId || !qty) {
      return toast.error("Select stock and quantity");
    }

    setSubmitting(true);

    try {
      const r = await placeOrder({
        stockId,
        type,
        quantity: parseInt(qty),
        orderType: "MARKET",
      });

      toast.success(r.data.message);

      await refreshUser();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Order failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  const isPositive = selected?.change >= 0;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-400">
                <BarChart3 className="h-4 w-4" />
                Trading
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Place Order
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Execute a market order and manage your position.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Market Open
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Order Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
              {/* Buy / Sell */}
              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setType("BUY")}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      type === "BUY"
                        ? "bg-emerald-500/15 text-emerald-400 shadow-sm ring-1 ring-emerald-500/20"
                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <ArrowUpFromLine className="h-4 w-4" />
                    BUY
                  </button>

                  <button
                    type="button"
                    onClick={() => setType("SELL")}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      type === "SELL"
                        ? "bg-red-500/15 text-red-400 shadow-sm ring-1 ring-red-500/20"
                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    SELL
                  </button>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {/* Stock */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Stock
                  </label>

                  <div className="relative">
                    <select
                      className="input mt-0 w-full appearance-none pr-10 transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                      value={stockId}
                      onChange={(e) => setStockId(e.target.value)}
                    >
                      {stocks.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.symbol} — {s.name} (₨
                          {s.currentPrice})
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                {/* Selected Stock */}
                {selected && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                          <BarChart3 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {selected.symbol}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selected.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          ₨{selected.currentPrice?.toLocaleString()}
                        </p>

                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-xs font-medium ${
                            isPositive ? "up" : "down"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}

                          {isPositive ? "+" : ""}
                          {selected.change} (
                          {isPositive ? "+" : ""}
                          {selected.changePercent}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Quantity
                    </label>

                    <span className="text-xs text-slate-600">
                      Shares
                    </span>
                  </div>

                  <input
                    className="input w-full text-lg font-semibold transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                  />
                </div>

                {/* Order Summary */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <CircleDollarSign className="h-4 w-4 text-blue-400" />
                    Order Summary
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Price
                      </span>
                      <span className="font-medium text-slate-300">
                        ₨
                        {selected?.currentPrice?.toLocaleString() ||
                          "0"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Quantity
                      </span>
                      <span className="font-medium text-slate-300">
                        {quantity}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Estimated value
                      </span>
                      <span className="font-medium text-slate-300">
                        ₨{total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Trading fee
                      </span>
                      <span className="text-slate-400">
                        ₨{fee.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="my-2 border-t border-slate-800" />

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-300">
                        Estimated total
                      </span>

                      <span className="text-lg font-bold text-white">
                        ₨
                        {grandTotal.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    type === "BUY"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-400"
                      : "bg-red-500 text-white shadow-lg shadow-red-500/10 hover:bg-red-400"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {type === "BUY" ? (
                        <ArrowUpFromLine className="h-4 w-4" />
                      ) : (
                        <ArrowDownToLine className="h-4 w-4" />
                      )}

                      {type} {qty} shares
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Side Info */}
            <div className="space-y-4">
              {/* Order Type */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <BarChart3 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Market Order
                    </p>
                    <p className="text-xs text-slate-500">
                      Instant execution
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  Your order will be executed at the current
                  market price available for the selected stock.
                </p>
              </div>

              {/* Current Selection */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current Selection
                </p>

                {selected ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400">
                        {selected.symbol}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {selected.changePercent}%
                      </span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-white">
                      ₨{selected.currentPrice?.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selected.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Minus className="h-4 w-4" />
                    No stock selected
                  </div>
                )}
              </div>

              {/* Fee Info */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Trading Fee
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  0.1%
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Estimated fee is included in the order
                  summary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        </div>
      }
    >
      <TradeForm />
    </Suspense>
  );
}