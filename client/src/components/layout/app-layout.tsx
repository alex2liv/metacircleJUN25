import { useState } from "react";
import { FloatingHelpButton } from "@/components/floating-help-button";
import { NotificationPanel } from "@/components/notification-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSelector } from "@/components/theme-selector";
import { CreateMenu } from "@/components/create-menu";
import { Search } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                  <defs>
                    <linearGradient id="metasync-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00bfff" />
                      <stop offset="100%" stopColor="#0080ff" />
                    </linearGradient>
                  </defs>
                  {/* Outer hexagon */}
                  <path d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z" stroke="url(#metasync-gradient)" strokeWidth="2" fill="none"/>
                  {/* Middle hexagon */}
                  <path d="M12 5 L17 8 L17 16 L12 19 L7 16 L7 8 Z" stroke="url(#metasync-gradient)" strokeWidth="1.5" fill="none"/>
                  {/* Inner hexagon */}
                  <path d="M12 8 L15 10 L15 14 L12 16 L9 14 L9 10 Z" stroke="url(#metasync-gradient)" strokeWidth="1" fill="none"/>
                  {/* Connecting lines */}
                  <line x1="12" y1="2" x2="12" y2="5" stroke="url(#metasync-gradient)" strokeWidth="0.8"/>
                  <line x1="20" y1="7" x2="17" y2="8" stroke="url(#metasync-gradient)" strokeWidth="0.8"/>
                  <line x1="4" y1="7" x2="7" y2="8" stroke="url(#metasync-gradient)" strokeWidth="0.8"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar na comunidade..."
                  className="block w-64 pl-10"
                />
              </div>
              
              {/* Notifications */}
              <NotificationPanel />
              
              {/* Theme Selector */}
              <ThemeSelector />
              
              {/* Create Menu */}
              <CreateMenu />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* Botão Flutuante de Ajuda */}
      <FloatingHelpButton />
    </div>
  );
}
