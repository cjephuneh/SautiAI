
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/pages/Overview";
import { Debtors } from "@/components/dashboard/pages/Debtors";
import { DebtorProfile } from "@/components/dashboard/pages/DebtorProfile";
import { AIAssistant } from "@/components/dashboard/pages/AIAssistant";
import { CallCenter } from "@/components/dashboard/pages/CallCenter";
import { Teams } from "@/components/dashboard/pages/Teams";
import { Analytics } from "@/components/dashboard/pages/Analytics";
import { Settings } from "@/components/dashboard/pages/Settings";
import { AdminPanel } from "@/components/dashboard/pages/AdminPanel";

export type DashboardPage = 
  | 'overview' 
  | 'debtors' 
  | 'debtor-profile' 
  | 'ai-assistant' 
  | 'call-center' 
  | 'teams' 
  | 'analytics' 
  | 'settings' 
  | 'admin';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'debtors':
        return <Debtors onSelectDebtor={(id) => {
          setSelectedDebtorId(id);
          setCurrentPage('debtor-profile');
        }} />;
      case 'debtor-profile':
        return <DebtorProfile debtorId={selectedDebtorId} onBack={() => setCurrentPage('debtors')} />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'call-center':
        return <CallCenter />;
      case 'teams':
        return <Teams />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
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
