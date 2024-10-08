import { PouchContentBase, PouchContentType } from '../pouch/pouch.base';

export type PostPouchContent = PouchContentBase & {
  type: PouchContentType.post;
  title: string;
  body: string;
};
