import {r} from '../observables/database';
import {Db} from 'rethinkdbdash';
import {curry} from 'ramda';
import {changes$Factory} from './utils';
import {Observable} from 'rx';

class Channel {
    id:string;
    externalId: any;
    title:string;
}

console.log(r.expr);

export const findChannelsQuery = curry(
    (db:Db, channelsIds:string[]) => {
        return db.table('channels')
            .filter(channel => {
                return r.expr(channelsIds)
                    .contains(channel('id'))
            })
    }
);

export const findChannels = curry(
    (db:Db, channelsIds:string[]) => {
        return Observable.fromPromise(
            findChannelsQuery(db, channelsIds).run()
        );
    }
);