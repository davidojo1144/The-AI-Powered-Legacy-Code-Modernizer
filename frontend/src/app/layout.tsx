import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered Legacy Code Modernizer",
  description: "Automated analysis tool that ingests legacy codebases and generates AI-driven modernization roadmaps",
  keywords: "legacy code, modernization, AI analysis, cloud migration, code refactoring",
  authors: [{ name: "davidojo1144", url: "https://github.com/davidojo1144" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative min-h-screen">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
          </div>

          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}