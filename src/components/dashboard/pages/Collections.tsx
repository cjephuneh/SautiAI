import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export const Collections = () => {
  const collections = [
    {
      id: 1,
      contact: "John Smith",
      amount: 1250,
      dueDate: "2024-01-20",
      status: "overdue",
      lastPayment: "2024-01-10",
      paymentPlan: "Active - KSh 200/month",
      priority: "high"
    },
    {
      id: 2,
      contact: "Sarah Johnson", 
      amount: 890,
      dueDate: "2024-01-25",
      status: "pending",
      lastPayment: "2023-12-15",
      paymentPlan: "None",
      priority: "medium"
    },
    {
      id: 3,
      contact: "Michael Brown",
      amount: 500,
      dueDate: "2024-01-18",
      status: "partial",
      lastPayment: "2024-01-15",
      paymentPlan: "Partial - KSh 100/week",
      priority: "medium"
    },
    {
      id: 4,
      contact: "Emma Davis",
      amount: 0,
      dueDate: "2024-01-12",
      status: "paid",
      lastPayment: "2024-01-12",
      paymentPlan: "Completed",
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'partial': return 'secondary';
      case 'pending': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Collection Management</h2>
        <p className="text-gray-600">Track and manage outstanding debts and payment plans</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600">KSh 847,392</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collected This Month</p>
                <p className="text-2xl font-bold text-green-600">KSh 284,592</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +18.3% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Accounts</p>
                <p className="text-2xl font-bold text-orange-600">143</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              -12 from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Payment Plans</p>
                <p className="text-2xl font-bold text-blue-600">89</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +7 new this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Status</CardTitle>
          <CardDescription>Monitor all active collection cases and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {collections.map((collection) => (
                  <div key={collection.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{collection.contact}</h3>
                          <p className="text-sm text-gray-500">Due: {collection.dueDate}</p>
                          <p className="text-sm text-gray-500">Last payment: {collection.lastPayment}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            KSh {collection.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{collection.paymentPlan}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(collection.status)} className="flex items-center gap-1">
                            {getStatusIcon(collection.status)}
                            {collection.status}
                          </Badge>
                          <Badge variant={collection.priority === 'high' ? 'destructive' : 'outline'}>
                            {collection.priority} priority
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Create Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Plans Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Payment Plans</CardTitle>
            <CardDescription>Current payment arrangements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Weekly Plans</p>
                  <p className="text-sm text-gray-600">34 active plans</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">KSh 45,200</p>
                  <p className="text-sm text-gray-500">Expected monthly</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Monthly Plans</p>
                  <p className="text-sm text-gray-600">55 active plans</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">KSh 127,800</p>
                  <p className="text-sm text-gray-500">Expected monthly</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Timeline</CardTitle>
            <CardDescription>Expected collections this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border-l-4 border-green-500 bg-gray-50">
                <div>
                  <p className="font-medium">This Week</p>
                  <p className="text-sm text-gray-600">23 payments due</p>
                </div>
                <p className="font-bold text-gray-900">KSh 34,500</p>
              </div>
              
              <div className="flex justify-between items-center p-3 border-l-4 border-blue-500 bg-gray-50">
                <div>
                  <p className="font-medium">Next Week</p>
                  <p className="text-sm text-gray-600">31 payments due</p>
                </div>
                <p className="font-bold text-gray-900">KSh 47,200</p>
              </div>
              
              <div className="flex justify-between items-center p-3 border-l-4 border-purple-500 bg-gray-50">
                <div>
                  <p className="font-medium">Rest of Month</p>
                  <p className="text-sm text-gray-600">67 payments due</p>
                </div>
                <p className="font-bold text-gray-900">KSh 89,300</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
