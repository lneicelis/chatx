import config from '../config';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes';

export function createApp() {
    const app = express();

    app.use(express.static(config.publicDir));
    app.use(bodyParser.json());

    routes(app);

    return app;
}

export function createHttpServer() {
    const app = createApp();

    return app.listen(config.api.port, function () {
        console.log('HTTP server is running on ' + config.api.port);
    });
}