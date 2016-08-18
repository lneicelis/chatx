import {Db} from 'rethinkdbdash';
import {curry, memoize} from 'ramda';
import {changes$Factory} from './utils';
import {Observable} from 'rx';
import {db} from '../observables/database';

class User {
    id:string;
    username:string;
    readChannels:string[];
    writeChannels:string[];
    socketConnections: number;
}

interface UserChange {
    'old_val':User|null
    'new_val':User|null
}

export const createUserUpdate$ = memoize(
    userId => userUpdate$Factory(userId, db).share()
);

export const userQuery = curry(
    (db:Db, userId:string) => {
        return db.table('users')
            .get(userId);
    }
);

export const updateUser = curry(
    (userId:string, data, db:Db) => {
        return db.table('users')
            .get(userId)
            .update(data)
            .run();
    }
);

export const getUser = curry(
    (userId:string, db:Db) => {
        return Observable.fromPromise(
            userQuery(db, userId).run()
        );
    }
);

export const userChange$Factory = curry(
    (userId:string, db:Db):Observable<UserChange> => {
        return changes$Factory(
            userQuery(db, userId)
        );
    }
);

export const userUpdate$Factory = curry(
    (userId:string, db:Db) => {
        return userChange$Factory(userId, db)
            .map(changes => changes.new_val)
    }
);