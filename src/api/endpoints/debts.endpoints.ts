import { AbstractEndpoints } from './abstract.endpoints';

export class DebtsEndpoints extends AbstractEndpoints {
  baseURL = 'Debts';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getById() {
    return `${this.getURL()}/GetDebtById`;
  }

  filter(pageNumber: string) {
    return `${this.getURL()}/FilterDebt?PageNumber=${pageNumber}`;
  }

  filterInstallments(pageNumber: string, pageSize: string, id: string, month: string, year: string, type: string, statusApp: string, debtType: string) {
    return `${this.getURL()}/FilterInstallments?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtId=${id}&Month=${month}&Year=${year}&DebtInstallmentType=${type}&StatusApp=${statusApp}&DebtType=${debtType}`;
  }

  getDebtByMonth(month: string, year: string) {
    return `${this.getURL()}/GetSumByMonth?Month=${month}&Year=${year}`;
  }

  deleteById(id: string) {
    return `${this.getURL()}/Delete?Id=${id}`;
  }

  put(id: string, status: string, date: string, walletId: string) {
    return `${this.getURL()}/InstallmentsStatus?Id=${id}&InstallmentsStatus=${status}&PaymentDate=${date}&WalletId=${walletId}`;
  }

}