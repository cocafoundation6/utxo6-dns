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

export interface TradeCredential {
  credentialType: string;
  issuer: string;
  hash: string;
  issuedAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

export interface ComplianceStatus {
  vleiValid: boolean;
  kycVerified: boolean;
  amlScreened: boolean;
  sanctionListChecked: boolean;
}

export interface TrustScoreResult {
  score: number;
  components: {
    vleiScore: number;
    complianceScore: number;
    historyScore: number;
    completenessScore: number;
  };
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}
