
import { Agent, Debt, CallRecord } from '@/types/debt';

export class AgentCoordinatorService {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const agentConfigs = [
      {
        id: 'core-debt-001',
        name: 'Core Debt Agent',
        type: 'core_debt' as const,
        config: { maxConcurrentCalls: 5, callTimeout: 300 }
      },
      {
        id: 'sentiment-001',
        name: 'Sentiment Analyzer',
        type: 'sentiment' as const,
        config: { confidenceThreshold: 0.8, responseTimeMs: 200 }
      },
      {
        id: 'priority-001',
        name: 'Debt Prioritizer',
        type: 'prioritization' as const,
        config: { refreshInterval: 300000, maxQueueSize: 1000 }
      },
      {
        id: 'scheduler-001',
        name: 'Call Scheduler',
        type: 'scheduling' as const,
        config: { lookAheadDays: 7, maxCallsPerHour: 10 }
      },
      {
        id: 'reminder-001',
        name: 'Payment Reminder',
        type: 'reminder' as const,
        config: { reminderDaysBefore: 1, maxReminders: 3 }
      },
      {
        id: 'compliance-001',
        name: 'Compliance Monitor',
        type: 'compliance' as const,
        config: { callHoursStart: '09:00', callHoursEnd: '17:00' }
      }
    ];

    agentConfigs.forEach(config => {
      const agent: Agent = {
        ...config,
        status: 'active',
        performance: {
          successRate: Math.random() * 0.3 + 0.7, // 70-100%
          averageResponseTime: Math.random() * 500 + 100, // 100-600ms
          tasksCompleted: Math.floor(Math.random() * 1000),
          lastActivity: new Date().toISOString()
        }
      };
      this.agents.set(agent.id, agent);
    });
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentsByType(type: Agent['type']): Agent[] {
    return this.getAllAgents().filter(agent => agent.type === type);
  }

  updateAgentPerformance(agentId: string, metrics: Partial<Agent['performance']>) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.performance = { ...agent.performance, ...metrics };
      agent.performance.lastActivity = new Date().toISOString();
    }
  }

  assignTask(taskType: Agent['type'], data: any): Agent | null {
    const availableAgents = this.getAgentsByType(taskType).filter(a => a.status === 'active');
    
    if (availableAgents.length === 0) return null;
    
    // Select agent with best performance
    const selectedAgent = availableAgents.reduce((best, current) => 
      current.performance.successRate > best.performance.successRate ? current : best
    );

    this.updateAgentPerformance(selectedAgent.id, {
      tasksCompleted: selectedAgent.performance.tasksCompleted + 1
    });

    return selectedAgent;
  }
}
