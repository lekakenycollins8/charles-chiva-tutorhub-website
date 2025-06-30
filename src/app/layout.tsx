import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import layout components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import SessionProvider wrapper (client component)
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chiva TutorHub - Professional Tutoring Services",
  description: "Professional tutoring services for Chemistry, Mathematics, Business Studies, and Accounting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>        
      </body>
    </html>
  );
}
