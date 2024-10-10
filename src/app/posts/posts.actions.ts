import { createAction, props } from '@ngrx/store';
import { PostPouchContent } from './posts.models';

export const updatePosts = createAction(
  '[Posts] Update',
  props<{ post: PostPouchContent }>()
);

export const addPost = createAction(
  '[Posts] Add',
  props<{ post: PostPouchContent }>()
);
