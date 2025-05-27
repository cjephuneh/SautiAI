
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Phone, 
  Users, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Settings, 
  ChevronLeft,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardPage } from "@/pages/Dashboard";

interface SidebarProps {
  currentPage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'overview' as DashboardPage, label: 'Overview', icon: LayoutDashboard },
  { id: 'calls' as DashboardPage, label: 'Call Management', icon: Phone },
  { id: 'contacts' as DashboardPage, label: 'Contacts', icon: Users },
  { id: 'collections' as DashboardPage, label: 'Collections', icon: DollarSign },
  { id: 'analytics' as DashboardPage, label: 'Analytics', icon: BarChart3 },
  { id: 'reports' as DashboardPage, label: 'Reports', icon: FileText },
  { id: 'settings' as DashboardPage, label: 'Settings', icon: Settings },
];

export const Sidebar = ({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DebtAI
              </span>
              <span className="text-[10px] text-gray-500 -mt-1">Dashboard</span>
            </div>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 h-8 w-8"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-1",
              currentPage === item.id 
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Link
          to="/"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Back to Home</span>}
        </Link>
      </div>
    </div>
  );
};
