import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Phone, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardApi, analyticsApi, contactsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface OverviewProps {
  onSelectCall?: (callId: string) => void;
}

interface DashboardStats {
  totalCalls: number;
  activeCalls: number;
  totalContacts: number;
  totalDebtAmount: number;
  successfulCalls: number;
  failedCalls: number;
  averageCallDuration: number;
  collectionRate: number;
}

interface CallLog {
  id: number;
  contact_name: string;
  phone_number: string;
  status: string;
  duration: number;
  started_at: string;
  agent_name?: string;
  outcome?: string;
}

export const Overview = ({ onSelectCall }: OverviewProps) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    activeCalls: 0,
    totalContacts: 0,
    totalDebtAmount: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageCallDuration: 0,
    collectionRate: 0
  });
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [
        summaryData,
        activeCallsData,
        callLogsData,
        contactsData,
        performanceData
      ] = await Promise.all([
        dashboardApi.getSummary().catch(() => null),
        dashboardApi.getActiveCalls().catch(() => []),
        dashboardApi.getCallLogs().catch(() => []),
        contactsApi.getContacts().catch(() => []),
        analyticsApi.getCollectionPerformance().catch(() => null)
      ]);

      // Process contacts data
      const contactsArray = Array.isArray(contactsData) ? contactsData : contactsData?.data || [];
      const totalDebtAmount = contactsArray.reduce((sum: number, contact: any) => sum + (contact.debt_amount || 0), 0);

      // Process call logs
      const callLogsArray = Array.isArray(callLogsData) ? callLogsData : callLogsData?.data || [];
      
      // Calculate stats
      const calculatedStats: DashboardStats = {
        totalCalls: summaryData?.total_calls || callLogsArray.length,
        activeCalls: Array.isArray(activeCallsData) ? activeCallsData.length : 0,
        totalContacts: contactsArray.length,
        totalDebtAmount: totalDebtAmount,
        successfulCalls: summaryData?.successful_calls || callLogsArray.filter((call: any) => call.status === 'completed').length,
        failedCalls: summaryData?.failed_calls || callLogsArray.filter((call: any) => call.status === 'failed').length,
        averageCallDuration: summaryData?.average_duration || calculateAverageDuration(callLogsArray),
        collectionRate: performanceData?.collection_rate || calculateCollectionRate(contactsArray)
      };

      setStats(calculatedStats);
      setRecentCalls(callLogsArray.slice(0, 10)); // Show last 10 calls
      setActiveCalls(Array.isArray(activeCallsData) ? activeCallsData : []);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageDuration = (calls: any[]) => {
    if (calls.length === 0) return 0;
    const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    return Math.round(totalDuration / calls.length);
  };

  const calculateCollectionRate = (contacts: any[]) => {
    if (contacts.length === 0) return 0;
    const paidContacts = contacts.filter(contact => contact.payment_status === 'paid').length;
    return Math.round((paidContacts / contacts.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const dashboardMetrics = [
    {
      label: "Total Calls Today",
      value: stats.totalCalls,
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Active Calls",
      value: stats.activeCalls,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Total Debt Amount",
      value: `KSh ${stats.totalDebtAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const performanceMetrics = [
    {
      label: "Successful Calls",
      value: stats.successfulCalls,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: "Failed Calls",
      value: stats.failedCalls,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      label: "Avg Call Duration",
      value: formatDuration(stats.averageCallDuration),
      icon: Clock,
      color: "text-blue-600"
    },
    {
      label: "Collection Rate",
      value: `${stats.collectionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.label} className="border-0 shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>Key performance indicators for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Calls */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Active Calls
            </CardTitle>
            <CardDescription>Currently ongoing calls</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCalls.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No active calls</p>
            ) : (
              <div className="space-y-3">
                {activeCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{call.contact_name || "Unknown Contact"}</p>
                      <p className="text-sm text-gray-600">{call.phone_number}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Calls
            </CardTitle>
            <CardDescription>Latest call activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentCalls.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent calls</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCalls.map((call) => (
                      <TableRow 
                        key={call.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => onSelectCall?.(call.id.toString())}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{call.contact_name || "Unknown"}</p>
                            <p className="text-sm text-gray-600">{call.phone_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs font-medium border", getStatusColor(call.status))}>
                            {call.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(call.duration || 0)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(call.started_at).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.reload()}
            >
              <Phone className="h-6 w-6" />
              Refresh Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 bg-white"
              onClick={() => console.log("View all calls")}
            >
              <Calendar className="h-6 w-6" />
              View All Calls
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 bg-white"
              onClick={() => console.log("Generate report")}
            >
              <BarChart3 className="h-6 w-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
