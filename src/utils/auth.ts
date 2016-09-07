import {path} from 'ramda';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export function sign(userId) {
    return jwt.sign({
        userId: userId
    }, config.secret);
}

export function decode(token) {
    return jwt.verify(token, config.secret);
}

export function authenticateSocket(socket) {
    const token = path(['handshake', 'query', 'token'], socket);

    socket.userId = jwt.verify(token, config.secret).userId;

    return socket;
}