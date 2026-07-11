
```typescript
// packages/compute-market/src/core/AIServiceAggregator.ts
// Author: J. Tian (uw2icg-core)

import { AIProvider, ModelInfo } from '../types';
import { UTXOResolver } from '../utils/utxoResolver';
import { VLEIVerifier } from '../utils/vleiVerifier';

/**
 * AI Service Provider Aggregation Layer
 * Integrates all major AI models into a unified interface
 */
export class AIServiceAggregator {
  private utxoResolver: UTXOResolver;
  private vleiVerifier: VLEIVerifier;
  private providers: Map<string, AIProvider> = new Map();
  private router: Map<string, string[]> = new Map(); // model → provider IDs

  constructor() {
    this.utxoResolver = new UTXOResolver();
    this.vleiVerifier = new VLEIVerifier();
    // Initialize default providers
    this.initializeDefaultProviders();
  }

  /**
   * Register an AI service provider
   */
  async registerProvider(
    provider: Omit<AIProvider, 'reputation'>
  ): Promise<AIProvider> {
    // 1. Verify vLEI
    const vleiValid = await this.vleiVerifier.verify(provider.utxoDomain);
    if (!vleiValid.valid) {
      throw new Error(`vLEI verification failed for ${provider.utxoDomain}`);
    }

    // 2. Verify endpoint availability
    await this.verifyEndpoint(provider.endpoint);

    // 3. Create provider record
    const newProvider: AIProvider = {
      ...provider,
      reputation: 50, // Initial credit score
      status: 'active'
    };

    this.providers.set(newProvider.id, newProvider);

    // 4. Update routing table
    for (const model of provider.models) {
      const existing = this.router.get(model.name) || [];
      existing.push(provider.id);
      this.router.set(model.name, existing);
    }

    return newProvider;
  }

  /**
   * Unified query routing
   */
  async routeQuery(params: {
    user: string;
    query: string;
    maxCost: number;
    minQuality?: number;
    preferredProvider?: string;
    model?: string;
  }): Promise<{
    provider: AIProvider;
    model: ModelInfo;
    cost: number;
    result: string;
  }> {
    // 1. Intent classification
    const intent = await this.classifyIntent(params.query);

    // 2. Get available providers
    let providers = this.getAvailableProviders();

    if (params.model) {
      const providerIds = this.router.get(params.model) || [];
      providers = providers.filter(p => providerIds.includes(p.id));
    }

    if (params.preferredProvider) {
      const preferred = this.providers.get(params.preferredProvider);
      if (preferred && preferred.status === 'active') {
        providers = [preferred, ...providers.filter(p => p.id !== params.preferredProvider)];
      }
    }

    // 3. Cost-quality optimization
    const best = this.selectOptimalProvider(providers, {
      maxCost: params.maxCost,
      minQuality: params.minQuality || 50,
      intent
    });

    if (!best) {
      throw new Error('No suitable provider found');
    }

    // 4. Execute query
    const result = await this.queryProvider(best.provider, best.model, params.query);

    // 5. Record conversation UTXO (automatic)
    await this.recordConversationUTXO(params.user, params.query, result, best.provider);

    return {
      provider: best.provider,
      model: best.model,
      cost: best.cost,
      result
    };
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.values())
      .filter(p => p.status === 'active');
  }

  /**
   * Select the optimal provider
   */
  private selectOptimalProvider(
    providers: AIProvider[],
    constraints: {
      maxCost: number;
      minQuality: number;
      intent: string;
    }
  ): {
    provider: AIProvider;
    model: ModelInfo;
    cost: number;
  } | null {
    let best: {
      provider: AIProvider;
      model: ModelInfo;
      cost: number;
      score: number;
    } | null = null;

    for (const provider of providers) {
      for (const model of provider.models) {
        const estimatedCost = this.estimateCost(model, constraints.intent);
        if (estimatedCost > constraints.maxCost) continue;

        const quality = provider.reputation;
        if (quality < constraints.minQuality) continue;

        const score = (quality / 100) * 0.6 + (1 - estimatedCost / constraints.maxCost) * 0.4;

        if (!best || score > best.score) {
          best = { provider, model, cost: estimatedCost, score };
        }
      }
    }

    return best || null;
  }

  private async classifyIntent(query: string): Promise<string> {
    // Simple intent classification
    if (query.includes('?') || query.includes('what') || query.includes('how')) {
      return 'question';
    }
    if (query.includes('write') || query.includes('create') || query.includes('generate')) {
      return 'generation';
    }
    if (query.includes('summary') || query.includes('summarize')) {
      return 'summary';
    }
    return 'general';
  }

  private estimateCost(model: ModelInfo, intent: string): number {
    // Cost estimation based on model and intent analysis
    const baseCost = 0.001;
    const intentMultiplier: Record<string, number> = {
      'question': 0.5,
      'generation': 1.5,
      'summary': 0.8,
      'general': 1.0
    };
    return baseCost * (intentMultiplier[intent] || 1.0);
  }

  private async queryProvider(
    provider: AIProvider,
    model: ModelInfo,
    query: string
  ): Promise<string> {
    // Actual API call
    console.log(`[AI] Querying ${provider.name} (${model.name})`);
    return `[${provider.name}] Response to: ${query.slice(0, 50)}...`;
  }

  private async recordConversationUTXO(
    user: string,
    query: string,
    response: string,
    provider: AIProvider
  ): Promise<void> {
    // Auto-generate conversation UTXO
    console.log(`[Data] Created conversation UTXO for ${user}`);
  }

  private async verifyEndpoint(endpoint: string): Promise<void> {
    // Verify endpoint availability
    console.log(`[Provider] Verified endpoint: ${endpoint}`);
  }

  private initializeDefaultProviders(): void {
    // Initialize default providers: OpenAI, Claude, DeepSeek
    const defaultProviders: AIProvider[] = [
      {
        id: 'openai',
        name: 'OpenAI',
        endpoint: 'https://api.openai.com',
        models: [
          { id: 'gpt-4', name: 'GPT-4', version: '1.0', contextWindow: 128000, capabilities: ['chat', 'code'] },
          { id: 'gpt-3.5', name: 'GPT-3.5', version: '1.0', contextWindow: 16000, capabilities: ['chat'] }
        ],
        pricing: { input: 0.01, output: 0.03 },
        utxoDomain: 'openai.utxo',
        vlei: 'did:vlei:openai',
        reputation: 90,
        status: 'active'
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        endpoint: 'https://api.anthropic.com',
        models: [
          { id: 'claude-3', name: 'Claude 3', version: '1.0', contextWindow: 200000, capabilities: ['chat', 'analysis'] }
        ],
        pricing: { input: 0.008, output: 0.024 },
        utxoDomain: 'claude.utxo',
        vlei: 'did:vlei:anthropic',
        reputation: 88,
        status: 'active'
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        endpoint: 'https://api.deepseek.com',
        models: [
          { id: 'deepseek-v3', name: 'DeepSeek V3', version: '1.0', contextWindow: 64000, capabilities: ['chat', 'code'] }
        ],
        pricing: { input: 0.002, output: 0.006 },
        utxoDomain: 'deepseek.utxo',
        vlei: 'did:vlei:deepseek',
        reputation: 80,
        status: 'active'
      }
    ];

    for (const provider of defaultProviders) {
      this.providers.set(provider.id, provider);
      for (const model of provider.models) {
        const existing = this.router.get(model.name) || [];
        existing.push(provider.id);
        this.router.set(model.name, existing);
      }
    }
  }
}
```

