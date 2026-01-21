import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StacksProvider } from "@/contexts/StacksProvider";
import { Navbar } from "@/components/common/Navbar";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import { ReownProvider } from "@/contexts/ReownProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StacksCoop - Community Transparency Ledger",
  description: "Bitcoin-anchored transparency for community organizations, cooperatives, and civic groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>
          <ReownProvider>
            <StacksProvider>
              <Navbar />
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {children}
              </div>
              <Toaster position="top-right" />
            </StacksProvider>
          </ReownProvider>
        </Providers>
      </body>
    </html>
  );
}
