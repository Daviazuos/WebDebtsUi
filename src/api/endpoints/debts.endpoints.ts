import { AbstractEndpoints } from './abstract.endpoints';

export class DebtsEndpoints extends AbstractEndpoints {
  baseURL = 'Debts';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getById(id: string) {
    return `${this.getURL()}/GetDebtById?Id=${id}`;
  }

  getDebtCategories(month: string, year: string, cardId: string | null) {
    const url = (cardId === undefined) ? `${this.getURL()}/GetDebtCategories?Month=${month}&Year=${year}` : `${this.getURL()}/GetDebtCategories?Month=${month}&Year=${year}&CardId=${cardId}`
    return url
  }

  getCategories() {
    return `${this.getURL()}/GetCategories`;
  }

  addCategory() {
    return `${this.getURL()}/CreateCategory`;
  }

  filter(pageNumber: string, pageSize: string, debtType: string, name: string, type: string, category: string, isGoal: boolean | null) {
    const url = (isGoal === null) ? `${this.getURL()}/FilterDebt?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtType=${debtType}&Name=${name}&DebtInstallmentType=${type}&Category=${category}` : 
                                    `${this.getURL()}/FilterDebt?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtType=${debtType}&Name=${name}&DebtInstallmentType=${type}&Category=${category}&IsGoal=${isGoal}` 

    return url;
  }

  filterWDate(pageNumber: string, pageSize: string, debtType: string, name: string, type: string, category: string, isGoal: boolean | null, startDate: string | null, fInishDate: string | null) {
    const url = (isGoal === null) ? `${this.getURL()}/FilterDebt?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtType=${debtType}&Name=${name}&DebtInstallmentType=${type}&Category=${category}&StartDate=${startDate}&FInishDate=${fInishDate}` : 
                                    `${this.getURL()}/FilterDebt?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtType=${debtType}&Name=${name}&DebtInstallmentType=${type}&Category=${category}&IsGoal=${isGoal}&StartDate=${startDate}&FInishDate=${fInishDate}` 

    return url;
  }

  filterInstallments(pageNumber: string, pageSize: string, id: string, month: string, year: string, type: string, statusApp: string, debtType: string, cardId: string, isGoal: boolean | null) {
    const url = (isGoal === null) ? `${this.getURL()}/FilterInstallments?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtId=${id}&Month=${month}&Year=${year}&DebtInstallmentType=${type}&StatusApp=${statusApp}&DebtType=${debtType}&CardId=${cardId}` : 
                                    `${this.getURL()}/FilterInstallments?PageNumber=${pageNumber}&PageSize=${pageSize}&DebtId=${id}&Month=${month}&Year=${year}&DebtInstallmentType=${type}&StatusApp=${statusApp}&DebtType=${debtType}&CardId=${cardId}&IsGoal=${isGoal}`;
   
    return url;
  }

  getDebtByMonth(month: string, year: string) {
    return `${this.getURL()}/GetSumByMonth?Month=${month}&Year=${year}`;
  }

  deleteById(id: string) {
    return `${this.getURL()}/Delete?Id=${id}`;
  }

  put(id: string, cardId: string, status: string, date: string, walletId: string) {
    const url = (cardId == null) ? `${this.getURL()}/InstallmentsStatus?Id=${id}&InstallmentsStatus=${status}&PaymentDate=${date}&WalletId=${walletId}` :
                                   `${this.getURL()}/InstallmentsStatus?CardId=${cardId}&InstallmentsStatus=${status}&PaymentDate=${date}&WalletId=${walletId}`
    return url;
  }

  putDebt(id: string) {
    return `${this.getURL()}/Edit?Id=${id}`;
  }

  putInstallment(id: string) {
    return `${this.getURL()}/Installments?Id=${id}`;
  }

  deleteInstallment(id: string) {
    return `${this.getURL()}/DeleteInstallment?Id=${id}`;
  }

  getDebtresponsibleParties(month: string, year: string, responsiblePartyId: string | null) {
    const url = (responsiblePartyId === undefined) ? `${this.getURL()}/GetResponsiblePartiesDebts?Month=${month}&Year=${year}` : `${this.getURL()}/GetDebtCategories?Month=${month}&Year=${year}&responsiblePartyId=${responsiblePartyId}`
    return url
  }

  getDraftsDebtsByUser() {
    return `${this.getURL()}/GetDraftsDebtsByUser`;
  }

  deleteDraft(id: string) {
    return `${this.getURL()}/DeleteDraftsDebtsById?Id=${id}`;
  }
}