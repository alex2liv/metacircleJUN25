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
              <svg width="32" height="32" viewBox="0 0 100 100" className="w-8 h-8">
                <defs>
                  <linearGradient id="metasyncGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Outer cube outline */}
                <path d="M20 35 L50 20 L80 35 L80 65 L50 80 L20 65 Z" fill="none" stroke="url(#metasyncGrad)" strokeWidth="3"/>
                {/* Middle cube outline */}
                <path d="M30 40 L50 30 L70 40 L70 60 L50 70 L30 60 Z" fill="none" stroke="url(#metasyncGrad)" strokeWidth="2"/>
                {/* Inner cube outline */}
                <path d="M40 45 L50 40 L60 45 L60 55 L50 60 L40 55 Z" fill="none" stroke="url(#metasyncGrad)" strokeWidth="1.5"/>
                {/* Connecting lines for 3D effect */}
                <line x1="20" y1="35" x2="30" y2="40" stroke="url(#metasyncGrad)" strokeWidth="1"/>
                <line x1="50" y1="20" x2="50" y2="30" stroke="url(#metasyncGrad)" strokeWidth="1"/>
                <line x1="80" y1="35" x2="70" y2="40" stroke="url(#metasyncGrad)" strokeWidth="1"/>
              </svg>
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
