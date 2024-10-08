import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PouchService } from './pouch/pouch.service';
import { PouchContentType } from './pouch/pouch.base';
import { Store } from '@ngrx/store';
import { addPost } from './posts/posts.actions';
import { selectPosts } from './posts/posts.selectors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
          title: this.title(),
          body: this.body(),
          type: PouchContentType.post,
        },
      })
    );

    this.title.set('');
    this.body.set('');
  }
}
