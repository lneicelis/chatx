import {Db} from 'rethinkdbdash';
import {curry, memoize} from 'ramda';
import {changes$Factory, runQuery} from './utils';
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

export const userQuery = (userId:string, database:Db) => {
    return database
        .table('users')
        .get(userId);
};

export function updateUser(userId:string, data, database:Db = db) {
    return database
        .table('users')
        .get(userId)
        .update(data)
        .run();
}

export function getUser(userId:string, database:Db = db) {
    return runQuery(userQuery(userId, database));
}

export function userChange$Factory(userId:string, database:Db = db):Observable<UserChange> {
    return changes$Factory(
        userQuery(userId, database)
    );
}

export function userUpdate$Factory(userId:string, database:Db = db):Observable<User> {
    return userChange$Factory(userId, database)
        .map(changes => changes.new_val)
}