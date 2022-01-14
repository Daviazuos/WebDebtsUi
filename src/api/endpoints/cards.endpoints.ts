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

  filterCards(month: string, year: string) {
    return `${this.getURL()}/FilterCards?Month=${month}&Year=${year}`;
  }
}
