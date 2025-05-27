export interface Debt {
  id: string;
  debtorId: string;
  debtorName: string;
  amount: number;
  currency: string;
  originalAmount: number;
  daysOverdue: number;
  lastPaymentDate?: string;
  brokenPromises: number;
  recentSuccessfulCalls: number;
  priorityScore: number;
  status: 'active' | 'paid' | 'settled' | 'disputed' | 'written_off';
  paymentPlan?: PaymentPlan;
  nextContactDate?: string;
  preferredContactTime?: string;
  compliance: ComplianceInfo;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPlan {
  id: string;
  totalAmount: number;
  installmentAmount: number;
  frequency: 'weekly' | 'monthly';
  nextPaymentDate: string;
  remainingPayments: number;
  status: 'active' | 'completed' | 'defaulted';
}

export interface ComplianceInfo {
  legalCallHours: {
    start: string;
    end: string;
  };
  maxCallsPerDay: number;
  lastCallDate?: string;
  callCount: number;
  disclosuresGiven: boolean;
}

export interface Agent {
  id: string;
  name: string;
  type: 'core_debt' | 'sentiment' | 'prioritization' | 'scheduling' | 'reminder' | 'compliance' | 'financial_assessment' | 'settlement' | 'credit_reporting' | 'summary' | 'contact_strategy' | 'predictive_analytics';
  status: 'active' | 'inactive' | 'error';
  performance: {
    successRate: number;
    averageResponseTime: number;
    tasksCompleted: number;
    lastActivity: string;
  };
  config: Record<string, any>;
}

export interface CallRecord {
  id: string;
  debtorId: string;
  agentId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  outcome: 'payment_promised' | 'payment_made' | 'no_answer' | 'refused_payment' | 'dispute_raised' | 'callback_requested';
  transcript: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentConfidence: number;
  paymentPromise?: {
    amount: number;
    dueDate: string;
    method: 'mpesa' | 'bank_transfer' | 'cash';
  };
  nextActions: string[];
}

export interface Communication {
  id: string;
  debtorId: string;
  channel: 'voice' | 'sms' | 'whatsapp' | 'email';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  agentId?: string;
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'payment_likelihood' | 'optimal_contact_time' | 'settlement_probability' | 'churn_risk';
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'deprecated';
  predictions: number;
  avgResponseTime: number;
  dataPoints: number;
}

export interface PaymentPrediction {
  debtorId: string;
  probability: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
    value: string;
  }[];
  recommendedAction: string;
  timeframe: string;
}

export interface ContactTimePrediction {
  debtorId: string;
  optimalTimes: {
    dayOfWeek: string;
    hour: number;
    successProbability: number;
  }[];
  timezone: string;
}

export interface SettlementPrediction {
  debtorId: string;
  recommendedDiscount: number;
  acceptanceProbability: number;
  reasoningFactors: string[];
}

export interface ChurnRiskPrediction {
  debtorId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  predictedChurnDate: string;
  preventiveActions: string[];
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  recommendedActions: string[];
  confidence: number;
  createdAt: string;
}
