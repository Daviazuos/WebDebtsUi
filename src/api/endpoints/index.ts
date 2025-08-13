import { CardsEndpoints } from '../endpoints/cards.endpoints';
import { DebtsEndpoints } from '../endpoints/debts.endpoints';
import { WalletsEndpoinst } from '../endpoints/wallet.endpoints';
import { SpendingCeiling } from '../endpoints/spendingCeiling.endpoints';
import { UserEndpoints } from './user.endpoints';
import { ResponsibleParty } from './responsibleParty.endpoints';
import { Planner } from './planner.endpoint';

export class Endpoints {
  static card = new CardsEndpoints();
  static debt = new DebtsEndpoints();
  static wallet = new WalletsEndpoinst();
  static user = new UserEndpoints();
  static spendingCeiling = new SpendingCeiling();
  static responsibleParty = new ResponsibleParty();
  static planer = new Planner()
}
