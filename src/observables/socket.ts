import {Observable} from 'rx';
import {authenticateSocket} from '../utils/auth';

const EVENT_ACTION = 'action';

export function socket$Factory(io) {
    return Observable.create(observer => {
        io.on('connection', socket => {
            observer.onNext(socket);
        });
    });
}

export function authorizedSocket$Factory(socket$: Observable) {
    return socket$
        .map(authenticateSocket)
        .catch(err => authorizedSocket$Factory(socket$));
}

export function actions$Factory(socket$: Observable) {
    return socket$.flatMap(socketActions$);
}

export function socketActions$(socket) {
    return Observable.create(observer => {
        const handler = event => observer.onNext(
            Object.assign({}, event, {userId: socket.userId})
        );

        socket.on(EVENT_ACTION, handler);

        return () => socket.removeListener(EVENT_ACTION, handler);
    });
}