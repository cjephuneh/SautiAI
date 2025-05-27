
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/pages/Overview";
import { Calls } from "@/components/dashboard/pages/Calls";
import { Contacts } from "@/components/dashboard/pages/Contacts";
import { Analytics } from "@/components/dashboard/pages/Analytics";
import { Collections } from "@/components/dashboard/pages/Collections";
import { Reports } from "@/components/dashboard/pages/Reports";
import { Settings } from "@/components/dashboard/pages/Settings";

export type DashboardPage = 'overview' | 'calls' | 'contacts' | 'analytics' | 'collections' | 'reports' | 'settings';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'calls':
        return <Calls />;
      case 'contacts':
        return <Contacts />;
      case 'analytics':
        return <Analytics />;
      case 'collections':
        return <Collections />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <DashboardHeader 
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
