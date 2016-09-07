import {Observable} from 'rx';
import {db$} from './database';
import {authorizedSocket$Factory, socketActions$} from './socket';
import {findUser, userUpdate$Factory} from '../repositories/user-repository';

export function userUpdates$(userId) {
    return db$.flatMap(userUpdate$Factory(userId));
}

export function user$(userId) {
    return db$.flatMap(findUser(userId));
}

export function createUser$(userId) {
    return user$(userId)
        .merge(userUpdates$(userId));
}

function userAction$(socket$) {
    return authorizedSocket$Factory(socket$)
        .flatMap(socket =>
            socketActions$(socket)
                .map(action => Object.assign({}, action, {
                    userId: socket.userId
                }))
        );
}