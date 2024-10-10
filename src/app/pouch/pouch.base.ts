import { PostPouchContent } from '../posts/posts.models';
import { UserPouchContent } from '../user/user.models';

export type PouchContentBase = Partial<PouchDB.Core.IdMeta> &
  Partial<PouchDB.Core.GetMeta> &
  Partial<PouchDB.Core.ChangesMeta>;

export enum PouchContentType {
  post = 'post',
  user = 'user',
}

export type PouchContent = PostPouchContent | UserPouchContent;
