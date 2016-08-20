import {Observable} from 'rx';
import {Db, Sequence} from 'rethinkdbdash';

class Change {
    new_val: any;
    old_val: any;
}

export function database$factory(dbName: string) {
    return function (r): Observable<Db>  {
        return Observable.of(r.db(dbName));
    };
}

export function runQuery(query: Sequence): Observable {
    return Observable.fromPromise(query.run())
}

export function changes$Factory(query): Observable<Change> {
    return Observable.create(observer => {
        let dispose;
        // TODO: close connection on dispose
        query.changes().run((err, cursor) => {
            if (err) observer.onError(err);

            cursor.each((err, change) => {
                if (err) observer.onError(err);

                observer.onNext(change);
            });

            dispose = cursor.close.bind(cursor);
        });

        return () => {
            console.log('changes connection closed', !!dispose);
            dispose();
        }
    });
}
