import {Observable} from 'rx';
import {Db} from 'rethinkdbdash';

export function database$factory(dbName: string) {
    return function (r): Observable<Db>  {
        return Observable.of(r.db(dbName));
    };
}

export function changes$Factory(query): Observable {
    return Observable.create(observer => {
        // TODO: close connection on dispose
        query.changes().run((err, cursor) => {
            if (err) observer.onError(err);

            cursor.each((err, change) => {
                if (err) observer.onError(err);

                observer.onNext(change);
            });
        });
    });
}