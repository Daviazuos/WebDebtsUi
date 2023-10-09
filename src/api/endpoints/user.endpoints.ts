import { AbstractEndpoints } from './abstract.endpoints';

export class UserEndpoints extends AbstractEndpoints {
  baseURL = 'User';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  login() {
    return `${this.getURL()}/Login`;
  }
}
