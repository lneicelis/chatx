import {r, db} from '../observables/database';
import {Db} from 'rethinkdbdash';
import {runQuery} from './utils';
import {Observable} from 'rx';

class Channel {
    id:string;
    title:string;
}

export function findChannels(channelsIds, database:Db = db) {
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

export function findChannel(channelId, database:Db = db) {
    return db
        .table('channels')
        .get(channelId)
        .run();
}

export function createChannel(data, database:Db = db) {
    return db
        .table('channels')
        .insert(data)
        .run();
}

export function updateChannel(channelId, data, database:Db = db) {
    return db
        .table('channels')
        .get(channelId)
        .update(data)
        .run();
}

export function deleteChannel(channelId, database:Db = db) {
    return db
        .table('channels')
        .get(channelId)
        .delete()
        .run();
}