import { PouchContentBase, PouchContentType } from '../pouch/pouch.base';

export type UserPouchContent = PouchContentBase & {
  type: PouchContentType.user;
  firstname: string;
  lastname: string;
};
