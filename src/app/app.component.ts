import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostPouchContent } from './posts/posts.models';
import { Store } from '@ngrx/store';
import { selectPosts } from './posts/posts.selectors';
import { addPost } from './posts/posts.actions';
import { PouchContentType } from './pouch/pouch.base';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = signal('');
  public body = signal('');
  public posts = this.store.selectSignal(selectPosts);

  constructor(private readonly store: Store) {}

  public addPost() {
    this.store.dispatch(
      addPost({
        post: {
          type: PouchContentType.post,
          title: this.title(),
          body: this.body(),
        },
      })
    );
    this.title.set('');
    this.body.set('');
  }
}
