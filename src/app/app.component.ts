import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PouchService } from './pouch/pouch.service';
import { PouchContentType } from './pouch/pouch.base';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ngrx-couchdb';

  constructor(private readonly pouchService: PouchService) {
    this.pouchService
      .changes(PouchContentType.game)
      .subscribe((changes) => console.debug(changes));
  }
}
