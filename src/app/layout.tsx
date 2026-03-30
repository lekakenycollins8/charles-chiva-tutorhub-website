// Polyfill localStorage for Node.js v25+ (must be first import)
import '@/polyfills/localStorage';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Import layout components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import AdminLayoutWrapper
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

// Import SEO components
import OrganizationSchema from "@/components/seo/OrganizationSchema";

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
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6972053895242408"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Organization Schema */}
        <OrganizationSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* AdminLayoutWrapper will handle rendering children for admin routes */}
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
        
        {/* Main site wrapper with navbar and footer for non-admin routes */}
        <div className="main-site-wrapper">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
