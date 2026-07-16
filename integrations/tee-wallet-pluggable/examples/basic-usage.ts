import {
  WalletManager,
  UTXODNSResolver,
  SimulatedTEEVerifier,
  MultiChainTxBuilder,
  IPv6Visualizer,
  VLEIValidator,
  LocalStorage
} from '../src';

async function main() {
  const wallet = new WalletManager({
    dnsResolver: new UTXODNSResolver('https://dns.utxo.coca'),
    teeVerifier: new SimulatedTEEVerifier(),
    txBuilder: new MultiChainTxBuilder(),
    visualizer: new IPv6Visualizer(),
    compliance: new VLEIValidator(),
    storage: new LocalStorage(),
  });
  await wallet.initialize();

  const book = await wallet.resolve('alice.utxo');
  console.log('Addresses:', book.addresses);

  if (wallet.getVisualizer()) {
    const colors = wallet.getVisualizer()!.getIPv6Colors(book.ipv6Fingerprint || '2001:db8::1');
    console.log('Color blocks:', wallet.getVisualizer()!.renderColorBlocks(colors));
  }

  const result = await wallet.pay({
    toDomain: 'bob.utxo',
    amount: '0.01',
    currency: 'BTC',
    requireTEEProof: true,
  });
  console.log('Payment sent:', result.txHash);
}

main().catch(console.error);
