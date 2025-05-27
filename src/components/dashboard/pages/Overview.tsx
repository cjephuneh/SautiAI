import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  Target,
  Award,
  Activity,
  CreditCard
} from "lucide-react";

export const Overview = () => {
  const stats = [
    {
      title: "Total Debt",
      value: "KSh 1,247,592",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Collected This Month",
      value: "KSh 284,592",
      change: "+18.3%",
      trend: "up", 
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Outstanding",
      value: "KSh 963,000",
      change: "-5.1%",
      trend: "down",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Active Debtors",
      value: "2,847",
      change: "+12.4%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const recentActivity = [
    { id: 1, type: "payment", debtor: "John Smith", amount: 2500, time: "5 mins ago", status: "completed" },
    { id: 2, type: "call", debtor: "Sarah Johnson", amount: 890, time: "12 mins ago", status: "in-progress" },
    { id: 3, type: "email", debtor: "Michael Brown", amount: 2100, time: "18 mins ago", status: "sent" },
    { id: 4, type: "payment", debtor: "Emma Davis", amount: 750, time: "25 mins ago", status: "completed" },
  ];

  const urgentTasks = [
    { id: 1, task: "Follow up with 15 overdue accounts", priority: "high", dueTime: "2:00 PM" },
    { id: 2, task: "Review settlement proposals", priority: "medium", dueTime: "4:30 PM" },
    { id: 3, task: "Team meeting - weekly targets", priority: "low", dueTime: "5:00 PM" },
  ];

  const collectionTargets = [
    { period: "Daily", target: 15000, current: 12500, percentage: 83 },
    { period: "Weekly", target: 75000, current: 68200, percentage: 91 },
    { period: "Monthly", target: 300000, current: 284592, percentage: 95 }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'call': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'email': return <Mail className="h-4 w-4 text-purple-600" />;
      case 'sms': return <MessageSquare className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good morning, John! 👋</h1>
            <p className="text-blue-100">Here's what's happening with your collections today</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">KSh {Math.round(Math.random() * 50000 + 10000).toLocaleString()}</p>
            <p className="text-blue-100">collected today</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest collection activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.debtor}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KSh {activity.amount.toLocaleString()}</p>
                    <Badge variant={
                      activity.status === 'completed' ? 'default' :
                      activity.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Phone className="h-4 w-4 mr-2" />
                Start AI Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Users className="h-4 w-4 mr-2" />
                Add New Debtor
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Bulk SMS
              </Button>
            </CardContent>
          </Card>

          {/* Urgent Tasks */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="mt-1">
                      {task.priority === 'high' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.dueTime}</p>
                    </div>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'secondary' : 'outline'
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Targets */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Collection Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collectionTargets.map((target) => (
                  <div key={target.period}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{target.period}</span>
                      <span className="text-sm text-gray-600">
                        KSh {target.current.toLocaleString()} / KSh {target.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={target.percentage} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{target.percentage}% achieved</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
