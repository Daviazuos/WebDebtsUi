import { AbstractEndpoints } from './abstract.endpoints';

export class CardsEndpoints extends AbstractEndpoints {
  baseURL = 'https://web-debts.herokuapp.com/';
  version = '';

  add() {
    return `${this.getURL()}/Card/Create`;
  }

  getById() {
    return `${this.getURL()}/Card/GetCardById`;
  }

  addValues() {
    return `${this.getURL()}/Card/AddValues`;
  }

  getCardValuesById() {
    return `${this.getURL()}/Card/GetCardValuesById`;
  }
}
