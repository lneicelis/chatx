import {path} from 'ramda';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export function authenticateSocket(socket) {
    const token = path(['handshake', 'query', 'token'], socket);

    console.log('token');

    // socket.userId = jwt.verify(token, config.secret).userId;
    socket.userId = 'b76ac650-7e7e-4555-9d08-ad560dd0ca1f';
    // console.log('userId', socket.userId);

    return socket;
}