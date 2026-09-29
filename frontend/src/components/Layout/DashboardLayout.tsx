import type { ReactNode } from "react";

import {
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>

      <div className="flex min-h-screen w-full bg-[#F8F7F4]">

        {/* Sidebar */}

        <AppSidebar />


        {/* Main */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* Navbar */}

          <Navbar />


          {/* Page Content */}

          <main className="flex-1">
            {children}
          </main>

        </div>

      </div>

    </SidebarProvider>
  );
}