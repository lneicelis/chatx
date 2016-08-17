import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import config from '../config';

export function authenticateSocket(socket) {
    const token = _.get(socket, 'handshake.query.token');

    console.log('token');

    // socket.userId = jwt.verify(token, config.secret).userId;
    socket.userId = 'b76ac650-7e7e-4555-9d08-ad560dd0ca1f';
    // console.log('userId', socket.userId);

    return socket;
}