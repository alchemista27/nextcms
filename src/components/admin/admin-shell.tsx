"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Toaster } from "sonner";

export function AdminShell({
  children,
  activeTheme,
}: {
  children: React.ReactNode;
  activeTheme?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTheme={activeTheme}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif" },
        }}
      />
    </div>
  );
}
