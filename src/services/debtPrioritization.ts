
import { Debt } from '@/types/debt';

export class DebtPrioritizationService {
  static calculatePriorityScore(debt: Debt): number {
    const debtAmountScore = debt.amount / 1000;
    const ageScore = (debt.daysOverdue / 30) * 10;
    const brokenPromiseScore = debt.brokenPromises * 15;
    const recentCallPenalty = debt.recentSuccessfulCalls * 20;
    
    return Math.max(0, debtAmountScore + ageScore + brokenPromiseScore - recentCallPenalty);
  }

  static prioritizeDebts(debts: Debt[]): Debt[] {
    return debts
      .map(debt => ({
        ...debt,
        priorityScore: this.calculatePriorityScore(debt)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  static getHighPriorityDebts(debts: Debt[], limit: number = 10): Debt[] {
    const prioritized = this.prioritizeDebts(debts);
    return prioritized.slice(0, limit);
  }

  static categorizeByPriority(debts: Debt[]): {
    critical: Debt[];
    high: Debt[];
    medium: Debt[];
    low: Debt[];
  } {
    const prioritized = this.prioritizeDebts(debts);
    
    return {
      critical: prioritized.filter(d => d.priorityScore >= 50),
      high: prioritized.filter(d => d.priorityScore >= 25 && d.priorityScore < 50),
      medium: prioritized.filter(d => d.priorityScore >= 10 && d.priorityScore < 25),
      low: prioritized.filter(d => d.priorityScore < 10)
    };
  }
}
