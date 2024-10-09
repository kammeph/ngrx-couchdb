import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostPouchContent } from './posts/posts.models';

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
  public posts = signal<PostPouchContent[]>([]);

  constructor() {}

  public addPost() {
    this.title.set('');
    this.body.set('');
  }
}
