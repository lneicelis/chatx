import {r, db} from '../observables/database';
import {Db} from 'rethinkdbdash';
import {runQuery} from './utils';
import {Observable} from 'rx';

class Channel {
    id:string;
    externalId: any;
    title:string;
}

export function findChannels(channelsIds, database:Db = db): Observable<Channel> {
    return runQuery(findChannelsQuery(channelsIds, database));
}

export function findChannelsQuery(channelsIds:string[], database:Db) {
    return database
        .table('channels')
        .filter(channel => {
            return r.expr(channelsIds)
                .contains(channel('id'))
        });
}