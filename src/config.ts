export default {
    baseUrl: 'http://185.5.54.166:3001',
    secret: process.env.APP_SECRET || 'MySecret',
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        file: './logs/logs.log'
    },
    rethinkdb: {
        host: 'localhost',
        port: 28015,
        db: process.env.DB_NAME || 'chatx'
    },
    api: {
        secret: 'SecretAPI',
        host: 'localhost',
        port: process.env.PORT || 3000
    },
    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET
    },
    publicDir: './static',
    storageDir: './storage'
};