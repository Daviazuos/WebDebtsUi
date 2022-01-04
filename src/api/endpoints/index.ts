import { CardsEndpoints } from '../endpoints/cards.endpoints';
import { DebtsEndpoints } from '../endpoints/debts.endpoints';
import { WalletsEndpoinst } from '../endpoints/wallet.endpoints';

export class Endpoints {
  static card = new CardsEndpoints();
  static debt = new DebtsEndpoints();
  static wallet = new WalletsEndpoinst();
}
