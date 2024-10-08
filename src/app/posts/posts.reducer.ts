import { createReducer, on } from '@ngrx/store';
import { updatePost, loadPosts, setPosts } from './posts.actions';
import { PostPouchContent } from './posts.models';

export interface PostsState {
  posts: PostPouchContent[];
  loading: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
};

export const postsReducer = createReducer(
  initialState,
  on(loadPosts, (state) => ({ ...state, loading: true })),
  on(setPosts, (state, { posts }) => ({ ...state, posts, loading: false })),
  on(updatePost, (state, { post }) => {
    if (post?._deleted) {
      return {
        ...state,
        posts: state.posts.filter((g) => g._id !== post._id),
      };
    }

    return {
      ...state,
      posts: post
        ? [...state.posts.filter((g) => g._id !== post._id), post]
        : [...state.posts],
    };
  })
);
