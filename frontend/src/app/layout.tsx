import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Origination Platform | Premium Insights",
  description: "Identify companies likely to enter a transaction window with AI capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-gray-100 min-h-screen font-sans flex`}
      >
        <Sidebar />
        <main className="flex-1 ml-64 p-8 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
          </div>
          
          <div className="fixed bottom-6 right-6 z-50">
             <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                <span className="p-1 rounded bg-white/10 text-white">CTRL K</span> Command Palette
             </div>
          </div>

          <CommandPalette />
          {children}
        </main>
      </body>
    </html>
  );
}
