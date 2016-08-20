import {createHttpServer} from './http/server';
import {attach} from './socket/server';

const server = createHttpServer();

attach(server);
