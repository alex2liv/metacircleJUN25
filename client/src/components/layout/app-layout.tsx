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
                src="/attached_assets/icone_matasync.png" 
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
