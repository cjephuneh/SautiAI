
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
