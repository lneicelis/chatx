import {Observable} from 'rx'
import * as rFactory from 'rethinkdbdash';
import config from '../config';
import {database$factory} from '../repositories/utils';

export const r = rFactory(config.rethinkdb);

export const db = r.db(config.rethinkdb.db);


export const r$ = Observable.of(r);
export const db$ = r$.flatMap(database$factory(config.rethinkdb.db));