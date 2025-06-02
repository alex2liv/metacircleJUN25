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
              <img 
                src="data:image/png;base64,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" 
                alt="MetaSync" 
                className="w-8 h-8"
              />
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
