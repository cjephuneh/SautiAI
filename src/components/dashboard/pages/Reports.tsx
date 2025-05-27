
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Eye
} from "lucide-react";

export const Reports = () => {
  const reports = [
    {
      id: 1,
      name: "Monthly Collection Summary",
      type: "financial",
      generated: "2024-01-15",
      period: "January 2024",
      status: "ready",
      size: "2.3 MB"
    },
    {
      id: 2,
      name: "Call Performance Report",
      type: "performance", 
      generated: "2024-01-14",
      period: "Week 2, January 2024",
      status: "ready",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Contact Activity Analysis",
      type: "analytics",
      generated: "2024-01-13", 
      period: "Q4 2023",
      status: "processing",
      size: "Processing..."
    },
    {
      id: 4,
      name: "Payment Plan Effectiveness",
      type: "analytics",
      generated: "2024-01-12",
      period: "December 2023",
      status: "ready", 
      size: "4.1 MB"
    }
  ];

  const quickReports = [
    {
      title: "Daily Summary",
      description: "Today's call and collection activity",
      icon: Calendar,
      action: "Generate Now"
    },
    {
      title: "Weekly Performance",
      description: "Last 7 days performance metrics",
      icon: BarChart3,
      action: "Generate Now"
    },
    {
      title: "Contact Export",
      description: "Export all contact information",
      icon: Users,
      action: "Export CSV"
    },
    {
      title: "Financial Summary",
      description: "Month-to-date financial overview",
      icon: DollarSign,
      action: "Generate Now"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'default';
      case 'processing': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'text-green-600';
      case 'performance': return 'text-blue-600';
      case 'analytics': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Generate and download comprehensive reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>Generate standard reports instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickReports.map((report) => (
              <div key={report.title} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <report.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  {report.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Report History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{report.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className={getTypeColor(report.type)}>{report.type}</span>
                            <span>•</span>
                            <span>{report.period}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                          <p className="text-xs text-gray-400">Generated on {report.generated}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        {report.status === 'ready' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {report.status === 'processing' && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3 animate-spin" />
                            Processing...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Report Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">47</div>
              <p className="text-sm text-gray-600">Reports generated this month</p>
              <p className="text-xs text-gray-500 mt-1">+23% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Collection Summary</div>
              <p className="text-sm text-gray-600">15 downloads this month</p>
              <p className="text-xs text-gray-500 mt-1">Financial report type</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-600">Auto-generated weekly</p>
              <p className="text-xs text-gray-500 mt-1">Next: Monday 9:00 AM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
