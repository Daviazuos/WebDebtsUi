import { AbstractEndpoints } from './abstract.endpoints';

export class WalletsEndpoinst extends AbstractEndpoints {
  baseURL = 'Wallet';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getById() {
    return `${this.getURL()}/GetWalletById`;
  }

  getEnable() {
    return `${this.getURL()}/GetEnableWallet`;
  }

  put(id: string) {
    return `${this.getURL()}/UpdateWallet?Id=${id}`;
  }
}
