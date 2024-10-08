import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostPouchContent } from '../posts/posts.models';
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
    post: new BehaviorSubject<PouchDB.Core.ExistingDocument<PostPouchContent> | null>(
      null
    ),
    user: new BehaviorSubject<PouchDB.Core.ExistingDocument<UserPouchContent> | null>(
      null
    ),
  };

  constructor() {
    this.init();
  }

  public changes<T extends PouchContentBase>(
    type: PouchContentType
  ): Observable<PouchDB.Core.ExistingDocument<T> | null> {
    return this._changes[type].asObservable();
  }

  public async getDoc<T extends PouchContentBase>(docId: string): Promise<T> {
    return await this.pouchDB!.get(docId);
  }

  public async postDoc<T extends PouchContentBase>(
    doc: PouchDB.Core.PostDocument<PouchContent & T>
  ): Promise<PouchDB.Core.Response> {
    return await this.pouchDB!.post(doc);
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

    await this.cacheAllDocs();
  }

  private processDocsChanges(
    docs: PouchDB.Core.ExistingDocument<PouchContent>[]
  ) {
    for (const doc of docs) {
      if (doc._deleted) {
        this.processDeletedDocs(doc);
        continue;
      }

      this.dispatchDocChanges(doc);
    }
  }

  private dispatchDocChanges(
    doc: PouchDB.Core.ExistingDocument<PouchContent>
  ): void {
    console.debug('[PouchService] dispatchDocChanges', doc);

    // check if doc type is supported
    if (this._changes[doc.type] || doc._deleted) {
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

  private async cacheAllDocs(): Promise<void> {
    console.time('[PouchService] cacheAllDocs');

    // load all docs
    const docs = await this.pouchDB!.allDocs({ include_docs: true });

    // process the docs changes
    await this.processDocsChanges(
      docs.rows
        .map((row) => row.doc!)
        .filter((doc) => !doc._id.startsWith('_design/'))
    );

    console.timeEnd('[PouchService] cacheAllDocs');
  }

  /**
   * Process the deleted docs.
   */
  private async processDeletedDocs(
    doc: PouchDB.Core.ExistingDocument<PouchContent>
  ): Promise<void> {
    // calculate last doc rev
    const rev = doc._revisions
      ? doc._revisions.start - 1 + '-' + doc._revisions.ids[1]
      : doc._rev;

    try {
      // get last doc by rev
      const lastDoc = await this.pouchDB!.get(doc._id, { rev });

      // set the type for the deleted doc. type is readonly so the as any is ok.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).type = lastDoc.type;
      console.debug('[PouchService] processDeletedDocs type', doc.type);
    } catch (error) {
      // can not get last doc by ref so just continue with next doc
      console.debug(
        '[PouchService] processDeletedDocs error',
        doc._id,
        rev,
        error
      );
    }

    // dispatch the doc changes
    this.dispatchDocChanges(doc);
  }
}
