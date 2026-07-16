import { WalletManager, UTXODNSResolver, SimulatedTEEVerifier, MultiChainTxBuilder } from '../src';

describe('WalletManager', () => {
  let wallet: WalletManager;
  beforeEach(async () => {
    wallet = new WalletManager({
      dnsResolver: new UTXODNSResolver('https://dns.test'),
      teeVerifier: new SimulatedTEEVerifier(),
      txBuilder: new MultiChainTxBuilder(),
    });
    await wallet.initialize();
  });

  test('should resolve domain', async () => {
    const book = await wallet.resolve('alice.utxo');
    expect(book.domain).toBe('alice.utxo');
    expect(book.addresses.btc).toBeDefined();
  });

  test('should send payment', async () => {
    const result = await wallet.pay({
      toDomain: 'bob.utxo',
      amount: '0.01',
      currency: 'BTC',
    });
    expect(result.txHash).toBeDefined();
    expect(result.chain).toBe('bitcoin');
  });
});
