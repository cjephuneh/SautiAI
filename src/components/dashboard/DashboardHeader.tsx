import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu, LogOut, User, Settings, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NotificationsModal } from "@/components/dashboard/modals/NotificationsModal";
import { HelpModal } from "@/components/ui/help-modal";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email || 'User';
  };

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
            <p className="text-sm text-gray-500">
              Welcome back{user?.full_name ? `, ${user.name.split(' ')[0]}` : ''}! Here's what's happening today.
            </p>
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

          {/* Help */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setHelpOpen(true)}
            className="hidden md:flex"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

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

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>

                {/* User Avatar */}
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-semibold">
                    {getUserInitials()}
                  </span>
                </div>

                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-4">
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
                  {user?.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                  {user?.role && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              {user && (
                <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Full Name</p>
                      <p className="font-medium">{user.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-medium truncate">{user.email || 'Not provided'}</p>
                    </div>
                    {user.phone_number && (
                      <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="font-medium">{user.phone_number}</p>
                      </div>
                    )}
                    {user.company && (
                      <div>
                        <p className="text-gray-500 text-xs">Company</p>
                        <p className="font-medium">{user.company}</p>
                      </div>
                    )}
                    {user.created_at && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <DropdownMenuSeparator />

              {/* Menu Items */}
              <div className="space-y-1">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
      
      <HelpModal 
        open={helpOpen} 
        onOpenChange={setHelpOpen} 
      />
    </>
  );
};
