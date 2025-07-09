"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  Video, 
  Settings, 
  LogOut,
  Mail 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Resources",
      href: "/admin/dashboard/resources",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Blog",
      href: "/admin/dashboard/blogs",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Contacts",
      href: "/admin/dashboard/contacts",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Videos",
      href: "/admin/dashboard/videos",
      icon: <Video className="h-5 w-5" />,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-blue-600">Chiva TutorHub</h1>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 group w-full"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
