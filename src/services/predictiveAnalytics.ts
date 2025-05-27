
import { Debt, Agent, CallRecord } from '@/types/debt';

export interface PredictionModel {
  id: string;
  name: string;
  type: 'payment_likelihood' | 'optimal_contact_time' | 'settlement_probability' | 'churn_risk';
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'deprecated';
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

export class PredictiveAnalyticsService {
  private models: Map<string, PredictionModel> = new Map();

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    const models: PredictionModel[] = [
      {
        id: 'payment_likelihood_v2',
        name: 'Payment Likelihood Predictor',
        type: 'payment_likelihood',
        accuracy: 0.847,
        lastTrained: '2024-01-25T10:30:00Z',
        status: 'active'
      },
      {
        id: 'contact_time_optimizer',
        name: 'Optimal Contact Time Predictor',
        type: 'optimal_contact_time',
        accuracy: 0.763,
        lastTrained: '2024-01-24T15:20:00Z',
        status: 'active'
      },
      {
        id: 'settlement_analyzer',
        name: 'Settlement Probability Model',
        type: 'settlement_probability',
        accuracy: 0.721,
        lastTrained: '2024-01-23T09:15:00Z',
        status: 'active'
      },
      {
        id: 'churn_predictor',
        name: 'Debtor Churn Risk Model',
        type: 'churn_risk',
        accuracy: 0.692,
        lastTrained: '2024-01-22T14:45:00Z',
        status: 'training'
      }
    ];

    models.forEach(model => this.models.set(model.id, model));
  }

  predictPaymentLikelihood(debt: Debt, callHistory: CallRecord[]): PaymentPrediction {
    // Simulate ML model prediction based on debt characteristics
    const factors = [
      {
        name: 'Debt Age',
        impact: debt.daysOverdue > 90 ? -0.3 : debt.daysOverdue > 30 ? -0.1 : 0.1,
        value: `${debt.daysOverdue} days overdue`
      },
      {
        name: 'Debt Amount',
        impact: debt.amount > 10000 ? -0.2 : debt.amount < 1000 ? 0.2 : 0,
        value: `$${debt.amount.toLocaleString()}`
      },
      {
        name: 'Payment History',
        impact: debt.brokenPromises > 2 ? -0.4 : debt.brokenPromises === 0 ? 0.3 : -0.1,
        value: `${debt.brokenPromises} broken promises`
      },
      {
        name: 'Recent Engagement',
        impact: debt.recentSuccessfulCalls > 0 ? 0.2 : -0.1,
        value: `${debt.recentSuccessfulCalls} recent calls`
      },
      {
        name: 'Call Response Rate',
        impact: callHistory.length > 0 ? 0.15 : -0.2,
        value: `${callHistory.length} total calls`
      }
    ];

    // Calculate base probability (70%) and adjust based on factors
    let probability = 0.7;
    factors.forEach(factor => {
      probability += factor.impact;
    });

    probability = Math.max(0.05, Math.min(0.95, probability));
    const confidence = 0.8 + Math.random() * 0.15; // 80-95% confidence

    let recommendedAction = 'Standard collection process';
    if (probability > 0.8) {
      recommendedAction = 'High priority - immediate contact recommended';
    } else if (probability < 0.3) {
      recommendedAction = 'Consider settlement offer or write-off evaluation';
    } else if (probability < 0.5) {
      recommendedAction = 'Increase contact frequency, consider payment plan';
    }

    return {
      debtorId: debt.debtorId,
      probability,
      confidence,
      factors,
      recommendedAction,
      timeframe: probability > 0.6 ? '7-14 days' : probability > 0.4 ? '14-30 days' : '30+ days'
    };
  }

  predictOptimalContactTime(debtorId: string, callHistory: CallRecord[]): ContactTimePrediction {
    // Analyze historical successful calls to predict optimal times
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const optimalTimes = dayMap.map((day, dayIndex) => {
      // Simulate analysis of successful call patterns
      const baseSuccessRate = 0.3;
      const dayMultiplier = dayIndex >= 1 && dayIndex <= 5 ? 1.2 : 0.8; // Weekdays better
      
      return Array.from({ length: 12 }, (_, hour) => {
        const actualHour = hour + 8; // 8 AM to 7 PM
        let hourMultiplier = 1;
        
        // Morning (9-11 AM) and afternoon (2-4 PM) are typically better
        if ((actualHour >= 9 && actualHour <= 11) || (actualHour >= 14 && actualHour <= 16)) {
          hourMultiplier = 1.4;
        } else if (actualHour < 9 || actualHour > 18) {
          hourMultiplier = 0.6;
        }
        
        return {
          dayOfWeek: day,
          hour: actualHour,
          successProbability: Math.min(0.85, baseSuccessRate * dayMultiplier * hourMultiplier)
        };
      });
    }).flat().sort((a, b) => b.successProbability - a.successProbability).slice(0, 10);

    return {
      debtorId,
      optimalTimes,
      timezone: 'UTC+3' // East Africa Time
    };
  }

  predictSettlementAcceptance(debt: Debt, callHistory: CallRecord[]): SettlementPrediction {
    // Factors influencing settlement acceptance
    const ageScore = debt.daysOverdue > 180 ? 0.8 : debt.daysOverdue > 90 ? 0.5 : 0.2;
    const amountScore = debt.amount > 5000 ? 0.7 : debt.amount > 1000 ? 0.5 : 0.3;
    const engagementScore = callHistory.length > 3 ? 0.6 : callHistory.length > 0 ? 0.4 : 0.1;
    const promiseScore = debt.brokenPromises > 1 ? 0.7 : 0.3;

    const acceptanceProbability = (ageScore + amountScore + engagementScore + promiseScore) / 4;
    
    // Recommend discount based on probability and debt characteristics
    let recommendedDiscount = 0.15; // 15% base discount
    if (acceptanceProbability > 0.7) recommendedDiscount = 0.25;
    if (debt.daysOverdue > 365) recommendedDiscount = 0.40;
    if (debt.brokenPromises > 3) recommendedDiscount = 0.35;

    const reasoningFactors = [
      `Debt age: ${debt.daysOverdue} days (${debt.daysOverdue > 180 ? 'high' : debt.daysOverdue > 90 ? 'medium' : 'low'} settlement likelihood)`,
      `Amount: $${debt.amount} (${debt.amount > 5000 ? 'high' : 'standard'} discount justified)`,
      `Engagement: ${callHistory.length} calls (${callHistory.length > 3 ? 'good' : 'limited'} response history)`,
      `Broken promises: ${debt.brokenPromises} (${debt.brokenPromises > 1 ? 'indicates payment difficulty' : 'good payment intent'})`
    ];

    return {
      debtorId: debt.debtorId,
      recommendedDiscount,
      acceptanceProbability,
      reasoningFactors
    };
  }

  predictChurnRisk(debt: Debt, callHistory: CallRecord[]): ChurnRiskPrediction {
    // Calculate churn risk based on engagement and payment patterns
    let riskScore = 0;

    // Days since last contact
    const daysSinceLastContact = callHistory.length > 0 ? 7 : 30; // Simplified
    if (daysSinceLastContact > 30) riskScore += 0.3;
    else if (daysSinceLastContact > 14) riskScore += 0.2;

    // Broken promises
    if (debt.brokenPromises > 3) riskScore += 0.4;
    else if (debt.brokenPromises > 1) riskScore += 0.2;

    // Call response rate
    if (callHistory.length === 0) riskScore += 0.3;

    // Debt age
    if (debt.daysOverdue > 180) riskScore += 0.2;

    riskScore = Math.min(1, riskScore);

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore > 0.7) riskLevel = 'high';
    else if (riskScore > 0.4) riskLevel = 'medium';

    const predictedChurnDate = new Date();
    predictedChurnDate.setDate(predictedChurnDate.getDate() + (riskLevel === 'high' ? 14 : riskLevel === 'medium' ? 30 : 60));

    const preventiveActions = [
      riskLevel === 'high' ? 'Immediate settlement offer' : 'Proactive outreach',
      'Payment plan restructuring',
      'Multi-channel engagement',
      riskLevel === 'high' ? 'Manager escalation' : 'Automated reminders'
    ];

    return {
      debtorId: debt.debtorId,
      riskLevel,
      riskScore,
      predictedChurnDate: predictedChurnDate.toISOString(),
      preventiveActions
    };
  }

  generateInsights(debts: Debt[], callHistory: CallRecord[]): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Collection rate trend analysis
    const recentCollectionRate = 0.73; // Simplified
    const previousCollectionRate = 0.68;
    if (recentCollectionRate > previousCollectionRate) {
      insights.push({
        id: 'collection_rate_trend',
        type: 'trend',
        title: 'Collection Rate Improvement',
        description: `Collection rate increased by ${((recentCollectionRate - previousCollectionRate) * 100).toFixed(1)}% this month`,
        impact: 'high',
        actionRequired: false,
        recommendedActions: ['Continue current strategies', 'Scale successful approaches'],
        confidence: 0.92,
        createdAt: new Date().toISOString()
      });
    }

    // High-risk debts requiring attention
    const highRiskDebts = debts.filter(debt => debt.brokenPromises > 2 && debt.daysOverdue > 90);
    if (highRiskDebts.length > 5) {
      insights.push({
        id: 'high_risk_debts',
        type: 'risk',
        title: 'High-Risk Debt Portfolio',
        description: `${highRiskDebts.length} debts showing high churn risk patterns`,
        impact: 'high',
        actionRequired: true,
        recommendedActions: ['Immediate settlement offers', 'Manager review', 'Payment plan restructuring'],
        confidence: 0.87,
        createdAt: new Date().toISOString()
      });
    }

    // Call timing optimization opportunity
    const callSuccessRate = callHistory.filter(call => call.outcome === 'payment_promised' || call.outcome === 'payment_made').length / callHistory.length;
    if (callSuccessRate < 0.4) {
      insights.push({
        id: 'call_timing_optimization',
        type: 'opportunity',
        title: 'Call Timing Optimization Needed',
        description: `Current call success rate is ${(callSuccessRate * 100).toFixed(1)}% - timing optimization could improve results`,
        impact: 'medium',
        actionRequired: true,
        recommendedActions: ['Analyze optimal contact times', 'Adjust calling schedules', 'A/B test different time slots'],
        confidence: 0.78,
        createdAt: new Date().toISOString()
      });
    }

    return insights;
  }

  getModels(): PredictionModel[] {
    return Array.from(this.models.values());
  }

  getModelPerformance(modelId: string) {
    const model = this.models.get(modelId);
    if (!model) return null;

    return {
      ...model,
      predictions: Math.floor(Math.random() * 1000) + 500,
      avgResponseTime: Math.floor(Math.random() * 200) + 50,
      dataPoints: Math.floor(Math.random() * 10000) + 5000
    };
  }
}
