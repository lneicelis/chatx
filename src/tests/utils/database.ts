process.env.DB_NAME = 'chatx_test';

import config from '../../config';
import * as rFactory from 'rethinkdbdash';

export const r = rFactory(config.rethinkdb);

export const cleanDb = async function () {
    var databases = await r.dbList().run();
    var tables = ['channels', 'messages', 'users'];

    if (databases.indexOf(config.rethinkdb.db) > -1) {
        console.log('Dropping database.');
        await r.dbDrop(config.rethinkdb.db).run();
    }
    console.log('Creating database: ' + config.rethinkdb.db);
    await r.dbCreate(config.rethinkdb.db).run();

    for (let table of tables) {
        console.log('Creating table: ', table);
        await r.db(config.rethinkdb.db).tableCreate(table).run();
    }

    console.log('tables created.');
};

export const loadFixtures = async function(table, data) {
    await r.db(config.rethinkdb.db)
        .table(table)
        .delete();

    await r.db(config.rethinkdb.db)
        .table(table)
        .insert(data)
        .run()
};

export const truncateTables = async function() {
    var tables = await r.db(config.rethinkdb.db).tableList();
    var promises = [];

    tables.forEach(function (table) {
        console.log('Truncating ' + table);
        promises.push(r.db(config.rethinkdb.db).table(table).delete().run());
    });

    await Promise.all(promises);
};