import {Observable} from 'rx'
import * as rFactory from 'rethinkdbdash';
import {database$factory} from '../repositories/utils';

const r = rFactory({
    host: 'localhost',
    port: 28015
});

export const r$ = Observable.of(r);
export const db$ = r$.flatMap(database$factory('chatx'));