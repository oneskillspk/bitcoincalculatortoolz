import { bitcoinApi } from './bitcoinApi';

export interface StackSatsInputs {
  currentBtcHoldings: number;
  targetBtcGoal: number;
  monthlyContribution: number;
  currency: string;
  expectedGrowthRate: number;
  startDate: Date;
}

export interface MilestoneCheckpoint {
  percentage: number;
  btcAmount: number;
  estimatedDate: Date;
  monthsFromNow: number;
}

export interface ScenarioResult {
  months: number;
  totalInvested: number;
  averageBuyPrice: number;
}

export interface StackSatsResult {
  monthsToGoal: number;
  yearsToGoal: number;
  projectedCompletionDate: Date;
  totalFiatInvested: number;
  totalBtcAtGoal: number;
  averageBuyPrice: number;
  monthlySatsPurchased: number[];
  progressMilestones: MilestoneCheckpoint[];
  alternativeScenarios: {
    conservative: ScenarioResult;
    moderate: ScenarioResult;
    optimistic: ScenarioResult;
  };
  currentProgress: number;
}

export class StackSatsCalculator {
  static async calculateGoal(inputs: StackSatsInputs): Promise<StackSatsResult> {
    // Get current BTC price
    const currentPrice = await bitcoinApi.getCurrentPrice(inputs.currency);
    
    // Calculate scenario with given growth rate
    const mainScenario = this.calculateScenario(
      inputs.currentBtcHoldings,
      inputs.targetBtcGoal,
      inputs.monthlyContribution,
      currentPrice,
      inputs.expectedGrowthRate
    );

    // Calculate alternative scenarios
    const conservative = this.calculateScenario(
      inputs.currentBtcHoldings,
      inputs.targetBtcGoal,
      inputs.monthlyContribution,
      currentPrice,
      10 // 10% conservative
    );

    const moderate = this.calculateScenario(
      inputs.currentBtcHoldings,
      inputs.targetBtcGoal,
      inputs.monthlyContribution,
      currentPrice,
      15 // 15% moderate
    );

    const optimistic = this.calculateScenario(
      inputs.currentBtcHoldings,
      inputs.targetBtcGoal,
      inputs.monthlyContribution,
      currentPrice,
      25 // 25% optimistic
    );

    // Generate milestones
    const progressMilestones = this.calculateMilestones(
      inputs.currentBtcHoldings,
      inputs.targetBtcGoal,
      mainScenario.months,
      inputs.startDate
    );

    // Calculate completion date
    const projectedCompletionDate = new Date(inputs.startDate);
    projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + mainScenario.months);

    // Calculate current progress
    const currentProgress = (inputs.currentBtcHoldings / inputs.targetBtcGoal) * 100;

    return {
      monthsToGoal: mainScenario.months,
      yearsToGoal: +(mainScenario.months / 12).toFixed(1),
      projectedCompletionDate,
      totalFiatInvested: mainScenario.totalInvested,
      totalBtcAtGoal: inputs.targetBtcGoal,
      averageBuyPrice: mainScenario.averageBuyPrice,
      monthlySatsPurchased: mainScenario.monthlySats || [],
      progressMilestones,
      alternativeScenarios: {
        conservative,
        moderate,
        optimistic
      },
      currentProgress
    };
  }

  private static calculateScenario(
    currentHoldings: number,
    targetGoal: number,
    monthlyContribution: number,
    currentPrice: number,
    growthRate: number
  ): ScenarioResult & { monthlySats?: number[] } {
    let btcAccumulated = currentHoldings;
    let months = 0;
    let totalInvested = 0;
    const monthlySats: number[] = [];
    const maxMonths = 600; // 50 years max

    while (btcAccumulated < targetGoal && months < maxMonths) {
      months++;
      
      // Calculate future price with compound growth
      const monthlyGrowthRate = growthRate / 100 / 12;
      const futurePrice = currentPrice * Math.pow(1 + monthlyGrowthRate, months);
      
      // Calculate BTC bought this month
      const btcBought = monthlyContribution / futurePrice;
      btcAccumulated += btcBought;
      totalInvested += monthlyContribution;
      
      // Store sats purchased (1 BTC = 100,000,000 sats)
      monthlySats.push(btcBought * 100000000);
    }

    const averageBuyPrice = totalInvested > 0 ? totalInvested / (btcAccumulated - currentHoldings) : currentPrice;

    return {
      months,
      totalInvested,
      averageBuyPrice,
      monthlySats
    };
  }

  private static calculateMilestones(
    currentHoldings: number,
    targetGoal: number,
    totalMonths: number,
    startDate: Date
  ): MilestoneCheckpoint[] {
    const milestones = [25, 50, 75, 100];
    const btcToAccumulate = targetGoal - currentHoldings;
    
    return milestones.map(percentage => {
      const btcAmount = currentHoldings + (btcToAccumulate * (percentage / 100));
      const monthsFromNow = Math.round((totalMonths * percentage) / 100);
      const estimatedDate = new Date(startDate);
      estimatedDate.setMonth(estimatedDate.getMonth() + monthsFromNow);

      return {
        percentage,
        btcAmount,
        estimatedDate,
        monthsFromNow
      };
    });
  }

  // Helper function for predefined goals
  static getPopularGoals() {
    return [
      { label: '1M Sats (0.01 BTC)', value: 0.01 },
      { label: '10M Sats (0.1 BTC)', value: 0.1 },
      { label: '50M Sats (0.5 BTC)', value: 0.5 },
      { label: 'Whole Coiner (1 BTC)', value: 1.0 },
      { label: 'Top 1% (2.1 BTC)', value: 2.1 }
    ];
  }
}
