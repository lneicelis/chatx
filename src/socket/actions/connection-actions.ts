import {createDebugObserver} from '../../utils/debug-observer';
import {getUser, updateUser,} from '../../repositories/user-repository';

export function handleSocketConnection(db$, socket$) {
    return socket$
        .do(socket => console.log('new socket', socket.userId))
        .flatMap(socket => db$
            .flatMap(getUser(socket.userId))
        )
        .map(user => Object.assign(user, {
            socketConnections: user.socketConnections
                ? ++user.socketConnections
                : 1
        }))
        .flatMap(user => db$
            .flatMap(updateUser(user.id, user))
        )
        .subscribe(
            createDebugObserver('handleSocketConnection')
        );
}

export function handleSocketDisconnect(db$, socket$) {
    return socket$
        .do(socket => console.log('new socket', socket.userId))
        .flatMap(socket => db$
            .flatMap(getUser(socket.userId))
        )
        .map(user => Object.assign(user, {
            socketConnections: --user.socketConnections
        }))
        .flatMap(user => db$
            .flatMap(updateUser(user.id, user))
        )
        .subscribe(
            createDebugObserver('handleSocketConnection')
        );
}