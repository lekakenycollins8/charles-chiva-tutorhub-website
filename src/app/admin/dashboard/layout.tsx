import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/actions/auth-actions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if user is authenticated and has admin role
  const { authenticated } = await checkAdminAuth();

  // Redirect to login page if not authenticated
  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Admin Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
