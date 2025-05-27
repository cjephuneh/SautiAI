
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users,
  Plus,
  Star,
  Trophy,
  Target,
  DollarSign,
  Phone,
  Mail,
  MessageSquare,
  Crown,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  Edit,
  MoreHorizontal
} from "lucide-react";

export const Teams = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  const agents = [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      avatar: "SW",
      role: "Senior Collector",
      status: "online",
      totalAssigned: 145,
      totalCollected: 89500,
      successRate: 76.2,
      avgCallDuration: "8:45",
      callsToday: 23,
      emailsSent: 12,
      whatsappSent: 8,
      rank: 1,
      performance: "excellent",
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      email: "mike.rodriguez@company.com",
      avatar: "MR",
      role: "Collector",
      status: "online",
      totalAssigned: 132,
      totalCollected: 67800,
      successRate: 68.9,
      avgCallDuration: "7:32",
      callsToday: 19,
      emailsSent: 15,
      whatsappSent: 11,
      rank: 2,
      performance: "good",
      joinDate: "2023-03-22"
    },
    {
      id: 3,
      name: "Lisa Chen",
      email: "lisa.chen@company.com",
      avatar: "LC",
      role: "Junior Collector",
      status: "busy",
      totalAssigned: 98,
      totalCollected: 45200,
      successRate: 61.4,
      avgCallDuration: "6:18",
      callsToday: 16,
      emailsSent: 9,
      whatsappSent: 6,
      rank: 3,
      performance: "improving",
      joinDate: "2023-08-10"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      avatar: "DK",
      role: "Collector",
      status: "offline",
      totalAssigned: 87,
      totalCollected: 38900,
      successRate: 59.2,
      avgCallDuration: "5:54",
      callsToday: 0,
      emailsSent: 6,
      whatsappSent: 3,
      rank: 4,
      performance: "needs-improvement",
      joinDate: "2023-06-05"
    }
  ];

  const teamStats = [
    { label: "Total Agents", value: agents.length, icon: Users, color: "text-blue-600" },
    { label: "Online Now", value: agents.filter(a => a.status === 'online').length, icon: CheckCircle, color: "text-green-600" },
    { label: "Total Collected", value: `$${agents.reduce((sum, a) => sum + a.totalCollected, 0).toLocaleString()}`, icon: DollarSign, color: "text-purple-600" },
    { label: "Avg Success Rate", value: `${Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length)}%`, icon: Target, color: "text-orange-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'improving': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-improvement': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Award className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-orange-500" />;
      default: return <Star className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage collectors and track team performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
          </select>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {teamStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Leaderboard */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Team Leaderboard
              </CardTitle>
              <CardDescription>Performance rankings for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.sort((a, b) => a.rank - b.rank).map((agent) => (
                  <div key={agent.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(agent.rank)}
                          <span className="text-sm font-medium text-gray-600">#{agent.rank}</span>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {agent.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-500">{agent.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                        <Badge className={getPerformanceColor(agent.performance)}>
                          {agent.performance.replace('-', ' ')}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">${agent.totalCollected.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Collected</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">{agent.successRate}%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">{agent.totalAssigned}</p>
                        <p className="text-xs text-gray-500">Assigned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-orange-600">{agent.avgCallDuration}</p>
                        <p className="text-xs text-gray-500">Avg Call</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{agent.callsToday}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{agent.emailsSent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{agent.whatsappSent}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="bg-white">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Top Performers
              </CardTitle>
              <CardDescription>This month's champions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Sarah Wilson</p>
                    <p className="text-xs text-gray-500">Highest Collections</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">$89.5K</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Mike Rodriguez</p>
                    <p className="text-xs text-gray-500">Best Success Rate</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-600">68.9%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Lisa Chen</p>
                    <p className="text-xs text-gray-500">Most Improved</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-600">+15%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Team Actions</CardTitle>
              <CardDescription>Manage your collection team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                Assign Bulk Debtors
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Trophy className="h-4 w-4 mr-2" />
                Performance Reports
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Clock className="h-4 w-4 mr-2" />
                Time Tracking
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Target className="h-4 w-4 mr-2" />
                Set Targets
              </Button>
            </CardContent>
          </Card>

          {/* Team Activity */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Sarah collected $2,500</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Mike completed 5 calls</p>
                    <p className="text-xs text-gray-500">12 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Lisa updated 8 records</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
