import { AbstractEndpoints } from './abstract.endpoints';

export class Planner extends AbstractEndpoints {
  baseURL = 'planner';
  version = '';

  add() {
    return `${this.getURL()}/Create`;
  }

  getByUser() {
    return `${this.getURL()}/GetByUserId`;
  }

  addItem(id: string) {
    return `${this.getURL()}/${id}/frequencies`;
  }

  AddCategory(plannerFrequencyId: string) {
    return `${this.getURL()}/frequency/${plannerFrequencyId}/categories`;
  }
}