import { Injectable } from '@angular/core';
import { PouchService } from '../pouch/pouch.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PouchContentType } from '../pouch/pouch.base';
import { exhaustMap, filter, from, map } from 'rxjs';
import { addPost, updatePosts } from './posts.actions';
import { PostPouchContent } from './posts.models';

@Injectable()
export class PostsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly pouchService: PouchService
  ) {}

  public postChanges$ = createEffect(() =>
    this.pouchService.changes<PostPouchContent>(PouchContentType.post).pipe(
      filter((post) => post !== null),
      map((post) => updatePosts({ post }))
    )
  );

  public addPost$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addPost),
        exhaustMap(({ post }) => from(this.pouchService.postDoc(post)))
      ),
    { dispatch: false }
  );
}
