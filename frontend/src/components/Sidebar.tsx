"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  ListOrdered,
  ArrowLeftRight,
  LogOut,
  CandlestickChart,
  Wallet,
} from "lucide-react";
import clsx from "clsx";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/market",
    label: "Market",
    icon: LineChart,
  },
  {
    href: "/trade",
    label: "Trade",
    icon: ArrowLeftRight,
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: Briefcase,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ListOrdered,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
      {/* Brand */}
      <div className="border-b border-slate-800 px-4 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/10">
            <CandlestickChart className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide text-white">
              StockEx
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Trading Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-3">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Workspace
        </p>

        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href;

          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-blue-500/10 text-blue-400 shadow-sm ring-1 ring-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              )}
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-slate-800/50 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span>{l.label}</span>

              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800 p-3">
        <div className="mb-2 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">
                {user?.name}
              </p>

              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                Account
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />

            <span className="text-[11px] text-slate-500">
              Wallet
            </span>

            <span className="ml-auto text-xs font-semibold text-emerald-400">
              {fmt(user?.walletBalance || 0)}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 transition-colors group-hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
}