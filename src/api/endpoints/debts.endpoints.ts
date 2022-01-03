import { AbstractEndpoints } from './abstract.endpoints';

export class DebtsEndpoints extends AbstractEndpoints {
  baseURL = 'Debts';
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

  getCardValuesById() {
    return `${this.getURL()}/GetCardValuesById`;
  }
}
