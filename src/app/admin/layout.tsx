import { ReactNode } from "react";
import { Geist } from "next/font/google";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";



// Set up font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="admin-layout">
      <SessionProviderWrapper>
        {children}
      </SessionProviderWrapper>
    </div>
  );
}
