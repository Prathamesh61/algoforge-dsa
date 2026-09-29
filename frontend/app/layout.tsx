import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Navbar } from "@/components/navigation/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { AuthProvider } from "@/features/auth/AuthContext";
import { AppShell } from "@/components/navigation/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoForge | Full-Stack DSA Learning, Visualization & Practice Platform",
  description: "Master Data Structures & Algorithms through interactive visualizations, structured courses, and real online code compilation judge.",
  keywords: ["DSA", "Data Structures", "Algorithms", "Visualizer", "LeetCode", "Online Judge", "Coding Practice"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-300`}>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
