
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export const Overview = () => {
  const stats = [
    {
      title: "Total Calls Today",
      value: "143",
      change: "+12%",
      trend: "up",
      icon: Phone,
      color: "text-blue-600"
    },
    {
      title: "Active Contacts",
      value: "2,847",
      change: "+5.2%", 
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Collections This Month",
      value: "$284,592",
      change: "+18.3%",
      trend: "up", 
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "73.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentCalls = [
    { id: 1, contact: "John Smith", status: "completed", time: "2 mins ago", amount: "$1,250" },
    { id: 2, contact: "Sarah Johnson", status: "in-progress", time: "5 mins ago", amount: "$890" },
    { id: 3, contact: "Michael Brown", status: "scheduled", time: "15 mins ago", amount: "$2,100" },
    { id: 4, contact: "Emma Davis", status: "completed", time: "23 mins ago", amount: "$750" },
  ];

  const upcomingTasks = [
    { id: 1, task: "Follow up with high-priority contacts", time: "10:00 AM", priority: "high" },
    { id: 2, task: "Weekly team meeting", time: "2:00 PM", priority: "medium" },
    { id: 3, task: "Review collection reports", time: "4:30 PM", priority: "low" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-600">{stat.change}</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Calls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Recent Calls
            </CardTitle>
            <CardDescription>Latest call activities and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {call.contact.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.contact}</p>
                      <p className="text-sm text-gray-500">{call.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{call.amount}</span>
                    <Badge variant={
                      call.status === 'completed' ? 'default' :
                      call.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Calls
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Start New Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="mt-1">
                      {task.priority === 'high' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                    <Badge size="sm" variant={
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
        </div>
      </div>
    </div>
  );
};
