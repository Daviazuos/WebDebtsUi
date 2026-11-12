import { AbstractEndpoints } from './abstract.endpoints';

export class CardsEndpoints extends AbstractEndpoints {
  baseURL = 'Card';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  edit(id: string) {
    return `${this.getURL()}/Edit?Id=${id}`;
  }

  getById() {
    return `${this.getURL()}/GetCardById`;
  }

  addValues(cardId: string) {
    return `${this.getURL()}/AddValues?CardId=${cardId}`;
  }

  filterCards(pageNumber: string, pageSize: string, id: string, month: string, year: string, withNoDebts: boolean = true) {
    if (id != null){
      return `${this.getURL()}/FilterCards?PageNumber=${pageNumber}&PageSize=${pageSize}&Id=${id}&Month=${month}&Year=${year}&withNoDebts=${withNoDebts}`;
    }
    else {
      return `${this.getURL()}/FilterCards?PageNumber=${pageNumber}&PageSize=${pageSize}&Month=${month}&Year=${year}&withNoDebts=${withNoDebts}`;
    }
    
  }

  monthlySummary(pageNumber: number, pageSize: number, month: string, year: string, withNoDebts: boolean, isPaid?: boolean) {
    const statusFilter = isPaid === undefined ? '' : `&IsPaid=${isPaid}`;
    return `${this.getURL()}/MonthlySummary?PageNumber=${pageNumber}&PageSize=${pageSize}&Month=${month}&Year=${year}&WithNoDebts=${withNoDebts}${statusFilter}`;
  }

  deleteById(cardId: string) {
    return `${this.getURL()}/DeleteCard?CardId=${cardId}`;
  }
}
