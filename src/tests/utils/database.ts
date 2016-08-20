process.env.DB_NAME = 'chatx_test';

import config from '../../config';
import * as rFactory from 'rethinkdbdash';
import {coroutine} from 'bluebird';

const r = rFactory(config.rethinkdb);

export const cleanDb = coroutine(function*() {
    var databases = yield r.dbList().run();
    var tables = ['channels', 'messages', 'users'];

    if (databases.indexOf(config.rethinkdb.db) > -1) {
        console.log('Dropping database.');
        yield r.dbDrop(config.rethinkdb.db).run();
    }
    console.log('Creating database.');
    yield r.dbCreate(config.rethinkdb.db).run();


    console.log('Creating tables.');
    tables.map(function (table) {
        return r.db(config.rethinkdb.db).tableCreate(table).run();
    });

    yield Promise.all(tables);
    console.log('tables created.');
});

export const loadFixtures = coroutine(function* (table, data) {
    yield r.db(config.rethinkdb.db)
        .table(table)
        .delete();

    yield r.db(config.rethinkdb.db)
        .table(table)
        .insert(data)
        .run()
});

export const truncateTables = coroutine(function* () {
    var tables = yield r.db(config.rethinkdb.db).tableList();
    var promises = [];

    tables.forEach(function (table) {
        console.log('Truncating ' + table);
        promises.push(r.db(config.rethinkdb.db).table(table).delete().run());
    });

    yield Promise.all(promises);
});