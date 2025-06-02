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
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <defs>
                    <linearGradient id="metasync-cube" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#0099ff" />
                    </linearGradient>
                  </defs>
                  {/* Outer cube frame */}
                  <path d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z" stroke="url(#metasync-cube)" strokeWidth="1.8" fill="none"/>
                  {/* Top face of outer cube */}
                  <path d="M8 12 L16 8 L24 12 L16 16 Z" stroke="url(#metasync-cube)" strokeWidth="1.8" fill="none"/>
                  {/* Left face of outer cube */}
                  <path d="M8 12 L8 20 L16 24 L16 16 Z" stroke="url(#metasync-cube)" strokeWidth="1.8" fill="none"/>
                  
                  {/* Middle cube frame */}
                  <path d="M10 13 L16 10.5 L22 13 L22 19 L16 21.5 L10 19 Z" stroke="url(#metasync-cube)" strokeWidth="1.4" fill="none"/>
                  {/* Top face of middle cube */}
                  <path d="M10 13 L16 10.5 L22 13 L16 15.5 Z" stroke="url(#metasync-cube)" strokeWidth="1.4" fill="none"/>
                  {/* Left face of middle cube */}
                  <path d="M10 13 L10 19 L16 21.5 L16 15.5 Z" stroke="url(#metasync-cube)" strokeWidth="1.4" fill="none"/>
                  
                  {/* Inner cube frame */}
                  <path d="M12 14 L16 12.5 L20 14 L20 18 L16 19.5 L12 18 Z" stroke="url(#metasync-cube)" strokeWidth="1" fill="none"/>
                  {/* Top face of inner cube */}
                  <path d="M12 14 L16 12.5 L20 14 L16 15.5 Z" stroke="url(#metasync-cube)" strokeWidth="1" fill="none"/>
                  {/* Left face of inner cube */}
                  <path d="M12 14 L12 18 L16 19.5 L16 15.5 Z" stroke="url(#metasync-cube)" strokeWidth="1" fill="none"/>
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
