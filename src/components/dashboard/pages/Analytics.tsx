
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign
} from "lucide-react";

export const Analytics = () => {
  const metrics = [
    {
      title: "Collection Rate",
      value: "73.2%",
      change: "+5.1%",
      trend: "up",
      period: "vs last month"
    },
    {
      title: "Average Call Duration", 
      value: "8:45",
      change: "-12s",
      trend: "down",
      period: "vs last week"
    },
    {
      title: "Revenue This Month",
      value: "$284,592",
      change: "+18.3%", 
      trend: "up",
      period: "vs last month"
    },
    {
      title: "Contact Resolution",
      value: "45.8%",
      change: "+2.7%",
      trend: "up", 
      period: "vs last month"
    }
  ];

  const monthlyData = [
    { month: "Jan", collections: 245000, calls: 1200, contacts: 2800 },
    { month: "Feb", collections: 267000, calls: 1350, contacts: 2950 },
    { month: "Mar", collections: 289000, calls: 1425, contacts: 3100 },
    { month: "Apr", collections: 234000, calls: 1180, contacts: 2850 },
    { month: "May", collections: 298000, calls: 1520, contacts: 3200 },
    { month: "Jun", collections: 312000, calls: 1680, contacts: 3400 }
  ];

  const campaignPerformance = [
    { name: "Email Follow-up", success: 68, total: 850, rate: "80%" },
    { name: "Phone Campaigns", success: 145, total: 200, rate: "72.5%" },
    { name: "SMS Reminders", success: 89, total: 150, rate: "59.3%" },
    { name: "Letter Campaigns", success: 34, total: 80, rate: "42.5%" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <p className="text-gray-600">Track performance metrics and gain insights into your collection operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center text-sm mt-1">
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                <span className="text-gray-500 ml-1">{metric.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Collections Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Collections
                </CardTitle>
                <CardDescription>Collections performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                    <p className="text-sm text-gray-400">Showing collections: $284K this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call Success Rate Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Call Outcomes
                </CardTitle>
                <CardDescription>Distribution of call results this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Pie chart would go here</p>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Successful: 73.2%</p>
                      <p>Missed: 18.5%</p>
                      <p>Scheduled: 8.3%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Important metrics for this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$284K</div>
                  <p className="text-sm text-gray-600">Total Collections</p>
                  <Badge className="mt-2 bg-green-100 text-green-700">↑ 18.3%</Badge>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,847</div>
                  <p className="text-sm text-gray-600">Contacts Reached</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700">↑ 12.1%</Badge>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">73.2%</div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700">↑ 5.1%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Success rates across different collection strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-500">{campaign.success} successful out of {campaign.total} attempts</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{campaign.rate}</div>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
