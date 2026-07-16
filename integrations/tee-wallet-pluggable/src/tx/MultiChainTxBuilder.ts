import { IMultiChainTxBuilder, AddressBook, PaymentRequest, PaymentResponse } from '../types';

export class MultiChainTxBuilder implements IMultiChainTxBuilder {
  async buildTx(addressBook: AddressBook, request: PaymentRequest): Promise<any> {
    const toAddr = addressBook.addresses[request.currency.toLowerCase()];
    if (!toAddr) throw new Error(`No address for currency ${request.currency}`);
    return { to: toAddr, amount: request.amount, chain: request.chain || 'bitcoin' };
  }
  async signAndBroadcast(tx: any): Promise<PaymentResponse> {
    // Simulate signing and broadcasting
    return {
      txHash: `0x${Buffer.from(tx.to).toString('hex').slice(0, 40)}`,
      chain: tx.chain,
      blockHeight: 123456
    };
  }
}
