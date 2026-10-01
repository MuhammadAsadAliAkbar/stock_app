import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockExchange - Trade Simulator",
  description: "Stock Exchange Management System with live simulation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#f1f5f9" } }} />
        </AuthProvider>
      </body>
    </html>
  );
}
