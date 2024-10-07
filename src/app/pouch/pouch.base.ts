import { GamePouchContent } from '../games/games.models';
import { UserPouchContent } from '../user/user.models';

export type PouchContentBase = PouchDB.Core.IdMeta &
  Partial<PouchDB.Core.GetMeta> &
  Partial<PouchDB.Core.ChangesMeta>;

export enum PouchContentType {
  game = 'game',
  user = 'user',
}

export type PouchContent = GamePouchContent | UserPouchContent;
