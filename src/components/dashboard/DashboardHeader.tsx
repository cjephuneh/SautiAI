
import { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NotificationsModal } from "@/components/dashboard/modals/NotificationsModal";
import type { DashboardPage } from "@/pages/Dashboard";

interface DashboardHeaderProps {
  currentPage: DashboardPage;
  onToggleSidebar: () => void;
}

const pageNames = {
  overview: 'Dashboard Overview',
  calls: 'Call Management',
  contacts: 'Contact Management', 
  analytics: 'Analytics & Insights',
  collections: 'Collection Management',
  reports: 'Reports & Documents',
  settings: 'Settings & Configuration'
};

export const DashboardHeader = ({ currentPage, onToggleSidebar }: DashboardHeaderProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {pageNames[currentPage]}
            </h1>
            <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-80 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 hover:bg-red-500">
                3
              </Badge>
            </Button>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </header>

      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </>
  );
};
