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
import { Collections } from "@/components/dashboard/pages/Collections";
import { Calls } from "@/components/dashboard/pages/Calls";
import { AgentDashboard } from "@/components/dashboard/pages/AgentDashboard";
import { PaymentProcessing } from "@/components/dashboard/pages/PaymentProcessing";
import { ComplianceCenter } from "@/components/dashboard/pages/ComplianceCenter";
import { PredictiveAnalytics } from "@/components/dashboard/pages/PredictiveAnalytics";
import CallLogs from "@/components/dashboard/pages/CallLogs";
import PhoneNumbers from "@/components/dashboard/pages/PhoneNumbers";
import Integrations from "@/components/dashboard/pages/Integrations";
import BatchCalling from "@/components/dashboard/pages/BatchCalling";
import Calendar from "@/components/dashboard/pages/Calendar";
import { Voices } from "@/components/dashboard/pages/Voices";
import { AgentCreation } from "@/components/dashboard/pages/AgentCreation";
import { FloatingHelpButton } from "@/components/ui/help-button";

export type DashboardPage = 
  | 'overview' 
  | 'debtors' 
  | 'debtor-profile' 
  | 'call-logs'
  | 'calendar'
  | 'batch-calling'
  | 'phone-numbers'
  | 'ai-assistant' 
  | 'voices'
  | 'agent-creation'
  | 'integrations'
  | 'call-center'
  | 'calls'
  | 'collections'
  | 'teams' 
  | 'analytics'
  | 'agent-dashboard'
  | 'payment-processing'
  | 'compliance-center'
  | 'predictive-analytics'
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
      case 'call-logs':
        return <CallLogs />;
      case 'calendar':
        return <Calendar />;
      case 'batch-calling':
        return <BatchCalling />;
      case 'phone-numbers':
        return <PhoneNumbers />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'voices':
        return <Voices />;
      case 'agent-creation':
        return <AgentCreation />;
      case 'integrations':
        return <Integrations />;
      case 'call-center':
        return <CallCenter />;
      case 'calls':
        return <Calls />;
      case 'collections':
        return <Collections />;
      case 'teams':
        return <Teams />;
      case 'analytics':
        return <Analytics />;
      case 'agent-dashboard':
        return <AgentDashboard />;
      case 'payment-processing':
        return <PaymentProcessing />;
      case 'compliance-center':
        return <ComplianceCenter />;
      case 'predictive-analytics':
        return <PredictiveAnalytics />;
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
          onNavigateToSettings={() => setCurrentPage('settings')}
        />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
      
      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default Dashboard;
