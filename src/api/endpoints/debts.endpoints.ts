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

  filter() {
    return `${this.getURL()}/FilterDebt`;
  }

  filterInstallments(id: string, month: string, year: string, type: string, statusApp: string) {
    return `${this.getURL()}/FilterInstallments?DebtId=${id}&Month=${month}&Year=${year}&DebtInstallmentType=${type}&StatusApp=${statusApp}`;
  }

  deleteById(id: string) {
    return `${this.getURL()}/Delete?Id=${id}`;
  }

  put(id: string, status: string) {
    return `${this.getURL()}/InstallmentsStatus?Id=${id}&InstallmentsStatus=${status}`;
  }
}
