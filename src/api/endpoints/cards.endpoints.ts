import { AbstractEndpoints } from './abstract.endpoints';

export class CardsEndpoints extends AbstractEndpoints {
  baseURL = 'Card';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getById() {
    return `${this.getURL()}/GetCardById`;
  }

  addValues() {
    return `${this.getURL()}/AddValues`;
  }

  filterCards(id: string, month: string, year: string) {
    if (id != null){
      return `${this.getURL()}/FilterCards?Id=${id}&Month=${month}&Year=${year}`;
    }
    else {
      return `${this.getURL()}/FilterCards?Month=${month}&Year=${year}`;
    }
    
  }
}
