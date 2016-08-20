import {merge} from 'ramda';
import {createDebugObserver} from '../../utils/debug-observer';
import {getUser, updateUser,} from '../../repositories/user-repository';

export function handleSocketConnection(socket$) {
    return socket$
        .flatMap(socket => getUser(socket.userId))
        .map(user => merge(user, {
            socketConnections: user.socketConnections
                ? ++user.socketConnections
                : 1
        }))
        .flatMap(user => updateUser(user.id, user))
        .subscribe(
            createDebugObserver('handleSocketConnection')
        );
}

export function handleSocketDisconnect(socket$) {
    return socket$
        .flatMap(socket => getUser(socket.userId))
        .map(user => merge(user, {
            socketConnections: --user.socketConnections
        }))
        .flatMap(user => updateUser(user.id, user))
        .subscribe(
            createDebugObserver('handleSocketDisconnect')
        );
}