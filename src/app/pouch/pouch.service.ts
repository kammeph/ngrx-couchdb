import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { BehaviorSubject, Observable } from 'rxjs';
import { GamePouchContent } from '../games/games.models';
import { UserPouchContent } from '../user/user.models';
import { PouchContent, PouchContentBase, PouchContentType } from './pouch.base';

@Injectable({
  providedIn: 'root',
})
export class PouchService {
  private dbUrl = 'http://admin:password@127.0.0.1:5984/admin/';
  private couchDB?: PouchDB.Database<PouchContent>;
  private pouchDB?: PouchDB.Database<PouchContent>;
  private _changes: {
    [key in PouchContentType]: BehaviorSubject<PouchDB.Core.ExistingDocument<any> | null>;
  } = {
    game: new BehaviorSubject<GamePouchContent | null>(null),
    user: new BehaviorSubject<UserPouchContent | null>(null),
  };

  constructor() {
    this.init();
  }

  public changes(type: PouchContentType): Observable<PouchContent | null> {
    return this._changes[type].asObservable();
  }

  public async getDoc<T extends PouchContentBase>(docId: string): Promise<T> {
    return await this.pouchDB!.get(docId);
  }

  public async putDoc<T extends PouchContentBase>(
    doc: PouchDB.Core.PutDocument<PouchContent & T>
  ): Promise<PouchDB.Core.Response> {
    return await this.pouchDB!.put(doc);
  }

  public async bulkDocs<T extends PouchContentBase>(
    docs: PouchDB.Core.PutDocument<T & PouchContent>[]
  ): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>> {
    return await this.pouchDB!.bulkDocs(docs);
  }

  public async removeDoc<T extends PouchContentBase>(
    doc: PouchDB.Core.PutDocument<T & PouchContent>
  ): Promise<PouchDB.Core.Response> {
    return await this.pouchDB!.put(doc);
  }

  public async init(): Promise<void> {
    this.couchDB = new PouchDB<PouchContent>(this.dbUrl);
    this.pouchDB = new PouchDB<PouchContent>('admin');

    const syncOptions: PouchDB.Replication.SyncOptions = {
      live: true,
      retry: true,
      batch_size: 1000,
    };
    console.info('init', !this.couchDB, !this.pouchDB);
    if (!this.pouchDB || !this.couchDB) return;

    console.info('sync');
    const sync = this.pouchDB.sync<PouchContent>(this.couchDB, syncOptions);
    sync.on(
      'change',
      async (info: PouchDB.Replication.SyncResult<PouchContent>) => {
        console.info('[PouchService] sync change', info);
        this.processDocsChanges(
          info.change.docs.filter((doc) => !doc._id.startsWith('_design/'))
        );
      }
    );
  }

  private processDocsChanges(
    docs: PouchDB.Core.ExistingDocument<PouchContent>[]
  ) {
    for (const doc of docs) {
      this.dispatchDocChanges(doc);
    }
  }

  private dispatchDocChanges(
    doc: PouchDB.Core.ExistingDocument<PouchContent>
  ): void {
    console.debug('[PouchService] dispatchDocChanges', doc);

    // check if doc type is supported
    if (this._changes[doc.type]) {
      console.debug('[PouchService] dispatchDocChanges type', doc.type);
      this._changes[doc.type].next(doc);
    } else {
      console.error(
        '[PouchService] dispatchDocChanges type not supported: ',
        doc.type,
        doc
      );
    }
  }
}
