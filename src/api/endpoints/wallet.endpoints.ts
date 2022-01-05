import { AbstractEndpoints } from './abstract.endpoints';

export class WalletsEndpoinst extends AbstractEndpoints {
  baseURL = 'Wallet';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getById(id: string) {
    return `${this.getURL()}/GetWalletById?walletId=${id}`;
  }

  getEnable() {
    return `${this.getURL()}/GetEnableWallets`;
  }

  put(id: string) {
    return `${this.getURL()}/UpdateWallet?Id=${id}`;
  }
}
