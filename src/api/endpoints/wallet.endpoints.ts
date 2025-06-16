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

  getEnable(month: string, year: string) {
    return `${this.getURL()}/GetWallets?month=${month}&year=${year}`;
  }

  getResponsiblePartyWallets(month: string, year: string) {
    return `${this.getURL()}/GetResponsiblePartiesWallets?month=${month}&year=${year}`;
  }

  put(id: string) {
    return `${this.getURL()}/UpdateWallet?Id=${id}`;
  }

  putInstallment(id: string) {
    return `${this.getURL()}/UpdateWalletInstallment?Id=${id}`;
  }
}
