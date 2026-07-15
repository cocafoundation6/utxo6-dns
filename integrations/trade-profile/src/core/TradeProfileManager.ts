import { UTXOResolver } from '../../../packages/compute-market/src/utils/utxoResolver';
import { VLEIVerifier } from '../../../packages/compute-market/src/utils/vleiVerifier';
import { TrustScoreCalculator } from './TrustScoreCalculator';
import { ComplianceChecker } from './ComplianceChecker';

export interface TradeProfile {
  domain: string;
  legalName: string;
  vlei: string;
  ipfsHash: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  trustScore: number;
}

export interface ProfileRegistrationParams {
  domain: string;
  legalName: string;
  vlei: string;
  tradeCredentials: {
    businessLicense?: string;
    taxId?: string;
    certifications?: string[];
  };
  complianceStatus: {
    kycVerified: boolean;
    amlScreened: boolean;
    sanctionListChecked: boolean;
  };
}

export interface CounterpartyVerificationResult {
  domain: string;
  trustScore: number;
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  details: {
    vleiValid: boolean;
    compliancePassed: boolean;
    profileComplete: boolean;
    tradeHistory: {
      totalTransactions: number;
      successfulTransactions: number;
    };
  };
}

/**
 * TradeProfileManager
 * Core class for managing enterprise trade profiles
 */
export class TradeProfileManager {
  private utxoResolver: UTXOResolver;
  private vleiVerifier: VLEIVerifier;
  private trustScoreCalculator: TrustScoreCalculator;
  private complianceChecker: ComplianceChecker;
  private profiles: Map<string, TradeProfile> = new Map();

  constructor() {
    this.utxoResolver = new UTXOResolver();
    this.vleiVerifier = new VLEIVerifier();
    this.trustScoreCalculator = new TrustScoreCalculator();
    this.complianceChecker = new ComplianceChecker();
  }

  /**
   * Register a new trade profile
   */
  async registerProfile(params: ProfileRegistrationParams): Promise<TradeProfile> {
    // 1. Verify the .utxo domain resolves
    const resolved = await this.utxoResolver.resolve(params.domain);
    if (!resolved) {
      throw new Error(`Domain ${params.domain} could not be resolved`);
    }

    // 2. Verify vLEI status
    const vleiStatus = await this.vleiVerifier.verify(params.domain);
    if (!vleiStatus.valid) {
      throw new Error(`vLEI verification failed for ${params.domain}`);
    }

    // 3. Store profile
    const profile: TradeProfile = {
      domain: params.domain,
      legalName: params.legalName,
      vlei: params.vlei,
      ipfsHash: '', // Would be generated from IPFS storage
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      trustScore: 50
    };

    this.profiles.set(params.domain, profile);

    // 4. Calculate initial trust score
    const score = await this.trustScoreCalculator.calculate({
      ...profile,
      credentials: params.tradeCredentials,
      compliance: params.complianceStatus
    });
    profile.trustScore = score;

    return profile;
  }

  /**
   * Verify a counterparty
   */
  async verifyCounterparty(domain: string): Promise<CounterpartyVerificationResult> {
    const profile = this.profiles.get(domain);
    if (!profile) {
      throw new Error(`Profile for ${domain} not found`);
    }

    // 1. Check vLEI status
    const vleiStatus = await this.vleiVerifier.verify(domain);

    // 2. Check compliance
    const complianceResult = await this.complianceChecker.check(domain);

    // 3. Calculate trust score
    const trustScore = await this.trustScoreCalculator.calculate(profile);

    // 4. Generate recommendation
    let recommendation: 'APPROVE' | 'REVIEW' | 'REJECT' = 'REVIEW';
    if (trustScore >= 80 && vleiStatus.valid && complianceResult.passed) {
      recommendation = 'APPROVE';
    } else if (trustScore < 40 || !vleiStatus.valid) {
      recommendation = 'REJECT';
    }

    return {
      domain,
      trustScore,
      recommendation,
      details: {
        vleiValid: vleiStatus.valid,
        compliancePassed: complianceResult.passed,
        profileComplete: this.isProfileComplete(profile),
        tradeHistory: {
          totalTransactions: 0,
          successfulTransactions: 0
        }
      }
    };
  }

  /**
   * Get profile by domain
   */
  async getProfile(domain: string): Promise<TradeProfile | null> {
    return this.profiles.get(domain) || null;
  }

  /**
   * Check if profile is complete
   */
  private isProfileComplete(profile: TradeProfile): boolean {
    return (
      profile.legalName !== '' &&
      profile.vlei !== '' &&
      profile.isActive
    );
  }
}
