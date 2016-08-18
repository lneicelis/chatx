import {r} from '../observables/database';
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

export const persistMessage = curry(
    (db:Db, message:Message) => {
        return db.table('messages')
            .insert(message)
            .run();
    }
);
export const findLatestInChannels = curry(
    (db:Db, channelsIds:string[]) => {
        return db.table('messages')
            .filter(function (message) {
                return r.expr(channelsIds)
                    .contains(message('channelId'))
            })
            .limit(10)
            .run()
    }
);