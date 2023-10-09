import { AbstractEndpoints } from './abstract.endpoints';

export class SpendingCeiling extends AbstractEndpoints {
  baseURL = 'SpendingCeiling';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getByMonth(month: string, year: string) {
    return `${this.getURL()}/GetByMonth?Month=${month}&Year=${year}`;
  }
}