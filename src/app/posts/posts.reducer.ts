import { createReducer, on } from '@ngrx/store';
import { PostPouchContent } from './posts.models';
import { updatePosts } from './posts.actions';

export interface PostsState {
  posts: PostPouchContent[];
}

const intitialState: PostsState = {
  posts: [],
};

export const postsReducer = createReducer(
  intitialState,
  on(updatePosts, (state, { post }) => {
    const posts = post._deleted
      ? state.posts.filter((p) => p._id !== post._id)
      : [...state.posts.filter((p) => p._id !== post._id), post];

    return {
      ...state,
      posts,
    };
  })
);
