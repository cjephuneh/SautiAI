import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  MessageSquare, 
  Bot, 
  BarChart3, 
  Settings, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Phone,
  Zap,
  Calendar as CalendarIcon,
  Volume2,
  Settings2
} from "lucide-react";
import type { DashboardPage } from "@/pages/Dashboard";

interface SidebarProps {
  currentPage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const menuItems = [
    { id: 'overview' as DashboardPage, label: 'Overview', icon: LayoutDashboard },
    { id: 'debtors' as DashboardPage, label: 'Users', icon: Users },
    { id: 'call-logs' as DashboardPage, label: 'Call Logs', icon: PhoneCall },
    { id: 'calendar' as DashboardPage, label: 'Calendar', icon: CalendarIcon },
    { id: 'ai-assistant' as DashboardPage, label: 'AI Assistant', icon: Bot },
    { id: 'voices' as DashboardPage, label: 'Voices', icon: Volume2 },
    { id: 'agents' as DashboardPage, label: 'AI Agents', icon: Settings2 },
    { id: 'batch-calling' as DashboardPage, label: 'Batch Communications', icon: Zap },
    { id: 'phone-numbers' as DashboardPage, label: 'Phone Numbers', icon: Phone },
    { id: 'integrations' as DashboardPage, label: 'Integrations', icon: Settings },
    // { id: 'messages' as DashboardPage, label: 'Messages', icon: MessageSquare },
    // { id: 'analytics' as DashboardPage, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SautiAI
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-11 transition-all",
              collapsed ? "px-3" : "px-4",
              currentPage === item.id 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => onPageChange(item.id)}
          >
            <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">Smart Collections Platform</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
