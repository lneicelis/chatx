import {createHttpServer} from './http/server';
import {createSocket} from './socket/server';

const server = createHttpServer();

createSocket(server);
