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

  getByMonthYear(month: string | null, year: string | null) {
    return `${this.getURL()}/user/month/${month}/year/${year}`;
  }

  updateCategory(plannerCategoryId: string) {
    return `${this.getURL()}/category/${plannerCategoryId}/budget`;
  }

  deleteCategory(plannerCategoryId: string) {
    return `${this.getURL()}/category/${plannerCategoryId}`;
  }

  deleteFrequency(plannerFrequencyId: string) {
    return `${this.getURL()}/frequency/${plannerFrequencyId}`;
  }

  updateFrequency(plannerFrequencyId: string) {
    return `${this.getURL()}/frequency/${plannerFrequencyId}/dates`;
  }
}