import {Observable} from 'rx'
import * as rFactory from 'rethinkdbdash';
import {database$factory} from '../repositories/utils';

export const r = rFactory({
    host: 'localhost',
    port: 28015
});

export const db = r.db('chatx');


export const r$ = Observable.of(r);
export const db$ = r$.flatMap(database$factory('chatx'));