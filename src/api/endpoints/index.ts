import { CardsEndpoints } from '../endpoints/cards.endpoints';
import { DebtsEndpoints } from '../endpoints/debts.endpoints';

export class Endpoints {
  static card = new CardsEndpoints();
  static debt = new DebtsEndpoints();
}
