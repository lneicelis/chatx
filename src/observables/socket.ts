import {Observable} from 'rx';
import {authenticateSocket} from '../utils/auth';
import Socket = SocketIO.Socket;

const EVENT_ACTION = 'action';
const EVENT_ERROR = 'error';
const EVENT_DISCONNECT = 'disconnect';

export function socket$Factory(io):Observable<Socket> {
    return Observable.create(observer => {
        const connectionHandler = socket => {
            observer.onNext(socket);
        };

        const errorHandler = error => {
            observer.onError(error);
        };

        const disconnectHandler = error => {
            observer.onCompleted(error);
        };

        io.on('error', errorHandler);
        io.on('connection', connectionHandler);
        io.on('disconnect', disconnectHandler);

        return () => {
            io.removeEventListener('error', errorHandler);
            io.removeEventListener('connection', connectionHandler);
            io.removeEventListener('disconnect', disconnectHandler);
        };
    });
}

export function createSocketDisconnect$(socket$) {
    return socket$
        .flatMap((socket:Socket) => {
            return Observable.fromEvent(socket, 'disconnect')
                .map(() => socket)
                .first()
        })
}

export function authorizedSocket$Factory(socket$) {
    return socket$
        .map(authenticateSocket)
        .catch(err => authorizedSocket$Factory(socket$));
}

export function actions$Factory(socket$) {
    return socket$.flatMap(socketActions$);
}

export function socketActions$(socket) {
    return Observable.create(observer => {
        const actionHandler = event => observer.onNext(
            Object.assign({}, event, {userId: socket.userId})
        );

        const errorHandler = error => {
            console.log('error', error);
            observer.onError(error);
        };

        const disconnectHandler = () => {
            console.log('completed');
            observer.onCompleted();
        };

        socket.on(EVENT_ACTION, actionHandler);
        socket.on(EVENT_ERROR, errorHandler);
        socket.on(EVENT_DISCONNECT, disconnectHandler);

        return () => {
            socket.removeListener(EVENT_ACTION, actionHandler);
            socket.removeListener(EVENT_ERROR, errorHandler);
            socket.removeListener(EVENT_DISCONNECT, disconnectHandler);
        };
    });
}

export function socketDisconnected(socket) {
    return Observable.fromEvent(socket, 'disconnect').first();
}