import {Db} from 'rethinkdbdash';
import {curry} from 'ramda';
import {changes$Factory} from './utils';
import {Observable} from 'rx';

class Message {
    id:string;
    userId:string;
    channelId:string;
    body:string;
    sentAt:string;
}

interface UserChange {
    'old_val':Message|null
    'new_val':Message|null
}

export const persistMessage = curry(
    (db: Db, message: Message) => {
        return db.table('messages')
            .insert(message)
            .run();
    }
);

export const userQuery = curry(
    (db:Db, userId:string) => {
        return db.table('users')
            .get(userId);
    }
);

export const user$Factory = curry(
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