import { createReducer, on } from '@ngrx/store';
import { updatePosts } from './posts.actions';
import { PostPouchContent } from './posts.models';

export interface PostsState {
  posts: PostPouchContent[];
}

const initialState: PostsState = {
  posts: [],
};

export const postsReducer = createReducer(
  initialState,
  on(updatePosts, (state, { post }) => {
    const posts = post._deleted
      ? state.posts.filter((g) => g._id !== post._id)
      : [...state.posts.filter((g) => g._id !== post._id), post];

    return {
      ...state,
      posts,
    };
  })
);
