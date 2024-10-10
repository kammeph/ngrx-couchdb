import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState } from './posts.reducer';

export const selectPostsFeature = createFeatureSelector<PostsState>('posts');

export const selectPosts = createSelector(
  selectPostsFeature,
  (state) => state.posts
);
