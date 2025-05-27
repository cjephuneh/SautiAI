
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AgentCoordinatorService } from "@/services/agentCoordinator";
import { Agent } from "@/types/debt";
import {
  Bot,
  Heart,
  Star,
  Calendar,
  Bell,
  Shield,
  Calculator,
  Handshake,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";

export const AgentDashboard = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [coordinator] = useState(new AgentCoordinatorService());

  useEffect(() => {
    setAgents(coordinator.getAllAgents());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(coordinator.getAllAgents());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [coordinator]);

  const getAgentIcon = (type: Agent['type']) => {
    const icons = {
      core_debt: Bot,
      sentiment: Heart,
      prioritization: Star,
      scheduling: Calendar,
      reminder: Bell,
      compliance: Shield,
      financial_assessment: Calculator,
      settlement: Handshake,
      credit_reporting: FileText,
      summary: MessageSquare,
      contact_strategy: Target,
      predictive_analytics: TrendingUp
    };
    return icons[type] || Bot;
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeLabel = (type: Agent['type']) => {
    const labels = {
      core_debt: 'Core Debt Agent',
      sentiment: 'Sentiment Analyzer',
      prioritization: 'Debt Prioritizer',
      scheduling: 'Call Scheduler',
      reminder: 'Payment Reminder',
      compliance: 'Compliance Monitor',
      financial_assessment: 'Financial Assessor',
      settlement: 'Settlement Negotiator',
      credit_reporting: 'Credit Reporter',
      summary: 'Call Summarizer',
      contact_strategy: 'Contact Strategist',
      predictive_analytics: 'Predictive Analyzer'
    };
    return labels[type] || 'Unknown Agent';
  };

  const systemMetrics = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    averageSuccessRate: agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length * 100,
    totalTasksCompleted: agents.reduce((sum, a) => sum + a.performance.tasksCompleted, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your AI agent workforce</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold">{systemMetrics.totalAgents}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.activeAgents}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{systemMetrics.averageSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-orange-600">{systemMetrics.totalTasksCompleted.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const IconComponent = getAgentIcon(agent.type);
          return (
            <Card key={agent.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>{getAgentTypeLabel(agent.type)}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold">{(agent.performance.successRate * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.performance.successRate * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Response Time</p>
                    <p className="font-semibold">{agent.performance.averageResponseTime.toFixed(0)}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tasks Done</p>
                    <p className="font-semibold">{agent.performance.tasksCompleted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Last active: {new Date(agent.performance.lastActivity).toLocaleTimeString()}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
