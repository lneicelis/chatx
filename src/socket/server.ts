import * as Server from 'socket.io';
import {compose} from 'ramda';
import config from '../config';
import {db$} from '../observables/database';
import {socket$Factory, authorizedSocket$Factory, actions$Factory} from '../observables/socket';
import {persistMessage} from '../repositories/message-repository';

export function createSocket(server) {
    const io = Server(server);

    const createSocket$ = compose(authorizedSocket$Factory, socket$Factory);

    const socket$ = createSocket$(io).share();
    const actions$ = actions$Factory(socket$);

    const sentMessage$ = actions$
        .filter(action => action.type === 'SEND_MESSAGE')
        .map(action => ({
            userId: null,
            body: action.message
        }));


    socket$.subscribe(() => {
        console.log('new connection');
    });

    actions$.subscribe(action => {
        console.log('action', action);
    });

    sentMessage$
        .withLatestFrom(
            db$,
            (message, db) => persistMessage(db, message)
        )
        .flatMap(result => result)
        .subscribe(result => console.log('Message persisted', result));
}
