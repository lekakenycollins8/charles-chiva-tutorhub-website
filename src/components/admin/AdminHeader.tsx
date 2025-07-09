"use client";

import { useState } from "react";
import { Menu, Bell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and search */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>
          
          {/* Right side - Notifications and profile */}
          <div className="flex items-center">           
            {/* Profile */}
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            
            {/* Sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </div>
              
              {/* Mobile sidebar content */}
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-blue-600">Chiva TutorHub</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {/* Mobile navigation items */}
                  {["Dashboard", "Resources", "Blog", "Messages", "Videos"].map((item) => (
                    <a
                      key={item}
                      href={`/admin/dashboard${item === "Dashboard" ? "" : `/${item.toLowerCase()}`}`}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              
              {/* Mobile logout button */}
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <a href="#" className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      A
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">Admin</div>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
                      Logout
                    </button>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
