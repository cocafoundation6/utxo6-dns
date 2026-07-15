import { TradeProfile } from './TradeProfileManager';

export interface ScoreComponents {
  vleiWeight: number;
  complianceWeight: number;
  historyWeight: number;
  completenessWeight: number;
}

export class TrustScoreCalculator {
  private weights: ScoreComponents = {
    vleiWeight: 0.30,
    complianceWeight: 0.25,
    historyWeight: 0.25,
    completenessWeight: 0.20
  };

  async calculate(profile: TradeProfile & { credentials?: any; compliance?: any }): Promise<number> {
    let score = 0;

    // 1. vLEI verification (0-30 points)
    const vleiScore = await this.calculateVLEIScore(profile);
    score += vleiScore * this.weights.vleiWeight;

    // 2. Compliance status (0-25 points)
    const complianceScore = this.calculateComplianceScore(profile);
    score += complianceScore * this.weights.complianceWeight;

    // 3. Trade history (0-25 points)
    const historyScore = this.calculateHistoryScore(profile);
    score += historyScore * this.weights.historyWeight;

    // 4. Profile completeness (0-20 points)
    const completenessScore = this.calculateCompletenessScore(profile);
    score += completenessScore * this.weights.completenessWeight;

    return Math.min(100, Math.round(score));
  }

  private async calculateVLEIScore(profile: any): Promise<number> {
    // Real vLEI verification
    return 100; // Placeholder
  }

  private calculateComplianceScore(profile: any): number {
    let score = 0;
    if (profile.compliance?.kycVerified) score += 40;
    if (profile.compliance?.amlScreened) score += 30;
    if (profile.compliance?.sanctionListChecked) score += 30;
    return score;
  }

  private calculateHistoryScore(profile: any): number {
    // Placeholder - would query on-chain trade history
    return 50;
  }

  private calculateCompletenessScore(profile: any): number {
    let score = 0;
    if (profile.legalName) score += 30;
    if (profile.vlei) score += 30;
    if (profile.credentials?.businessLicense) score += 20;
    if (profile.credentials?.taxId) score += 20;
    return score;
  }
}
