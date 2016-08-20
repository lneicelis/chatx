import {r, db} from '../observables/database';
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

export function persistMessage(message:Message, database:Db = db) {
    return database
        .table('messages')
        .insert(message)
        .run();
}


export function findLatestInChannels(channelsIds:string[], limit = 10, database:Db = db) {
    return database
        .table('messages')
        .filter(message => {
            return r.expr(channelsIds)
                .contains(message('channelId'))
        })
        .limit(limit)
        .run()
}

export const createMessages$ = (db): Observable<Message> => {
    return changes$Factory(db.table('messages'))
        .map(change => change.new_val);
};