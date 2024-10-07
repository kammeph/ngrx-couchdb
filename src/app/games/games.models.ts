import { PouchContentBase, PouchContentType } from '../pouch/pouch.base';

export type GamePouchContent = PouchContentBase & {
  type: PouchContentType.game;
  title: string;
  year: number;
};
