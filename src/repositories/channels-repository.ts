import {Db, expr} from 'rethinkdbdash';
import {curry} from 'ramda';
import {changes$Factory} from './utils';
import {Observable} from 'rx';

class Channel {
    id:string;
    externalId: any;
    title:string;
}

export const findChannelsQuery = curry(
    (db:Db, channelsIds:string[]) => {
        return db.table('channels')
            .filter(channel => {
                return expr(channelsIds)
                    .contains(channel('id'))
            })
    }
);

export const findChannels = curry(
    (db:Db, channelsIds:string[]) => {
        return Observable.fromPromise(
            findChannels(db, channelsIds).run()
        );
    }
);