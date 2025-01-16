import { AbstractEndpoints } from './abstract.endpoints';

export class ResponsibleParty extends AbstractEndpoints {
  baseURL = 'ResponsibleParty';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getByUser() {
    return `${this.getURL()}/GetByUserId`;
  }
}