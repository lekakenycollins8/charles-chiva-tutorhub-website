import { ReactNode } from "react";
import { Geist } from "next/font/google";



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
      {children}
    </div>
  );
}
