import { AddressBook, PaymentRequest, PaymentResponse } from '../types';

export interface IMultiChainTxBuilder {
  buildTx(addressBook: AddressBook, request: PaymentRequest): Promise<any>;
  signAndBroadcast(tx: any): Promise<PaymentResponse>;
}
