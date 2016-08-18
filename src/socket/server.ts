import * as Server from 'socket.io';
import {compose} from 'ramda';
import config from '../config';
import {db$} from '../observables/database';
import {
    socket$Factory, authorizedSocket$Factory, actions$Factory, createSocketDisconnect$
} from '../observables/socket';
import {createMessages$} from '../repositories/message-repository';
import {handleSocketConnection, handleSocketDisconnect} from './actions/connection-actions';
import {pushLatestMessages, handleIncomingMessages, pushNewMessages} from './actions/message-actions';
import {pushChannels} from './actions/channel-actions';

export function createSocket(server) {
    const io = Server(server);

    const createSocket$ = compose(authorizedSocket$Factory, socket$Factory);

    const socket$ = createSocket$(io).share();
    const socketDisconnect$ = createSocketDisconnect$(socket$);
    const actions$ = actions$Factory(socket$);
    const messages$ = db$.flatMap(createMessages$).share();

    handleSocketConnection(db$, socket$);
    handleSocketDisconnect(db$, socketDisconnect$);

    pushChannels(db$, socket$);
    pushLatestMessages(db$, socket$);

    handleIncomingMessages(db$, actions$);

    pushNewMessages(messages$, socket$);
}
