import { AddressBook, PaymentRequest, PaymentResponse, UnsignedTransaction } from '@utxodns/core';

/**
 * Multi-Chain Transaction Builder Interface
 */
export interface IMultiChainTxBuilder {
  buildTx(addressBook: AddressBook, request: PaymentRequest): Promise<UnsignedTransaction>;
  signAndBroadcast(tx: UnsignedTransaction): Promise<PaymentResponse>;
  getTxStatus(txHash: string, chain: string): Promise<{ confirmed: boolean; blockHeight?: number }>;
}
