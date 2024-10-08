import { createAction, props } from '@ngrx/store';
import { PostPouchContent } from './posts.models';

export const loadPosts = createAction('[Posts] Load');

export const setPosts = createAction(
  '[Posts] Set',
  props<{ posts: PostPouchContent[] }>()
);

export const updatePost = createAction(
  '[Posts] Update',
  props<{ post: PostPouchContent | null }>()
);

export const addPost = createAction(
  '[Posts] Add',
  props<{ post: PostPouchContent }>()
);
