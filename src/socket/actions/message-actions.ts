import {merge, curry} from 'ramda';
import {Observable} from 'rx';
import {createDebugObserver} from '../../utils/debug-observer';
import {emitAction, C2S_SEND_MESSAGE, S2C_SEND_MESSAGES} from '../action-types';
import {getUser, createUserUpdate$} from '../../repositories/user-repository';
import {persistMessage, findLatestInChannels} from '../../repositories/message-repository';

// Todo assert that user can write to channel
export const isMessageValid = message => {
    return !!message.userId
        && !!message.channelId
        && !!message.body;
};

export const validMessage$ = curry(
    (getUser, db$, message) => {
        return db$.flatMap(getUser(message.userId))
            .filter(user => {
                return user.writeChannels
                    && user.writeChannels.includes(message.channelId)
            })
            .map(() => message)
            .catch(() => {
                console.log('Invalid message', message);

                return Observable.empty()
            });
    }
);

export function pushNewMessages(message$, socket$) {
    return socket$
        .flatMap(socket => {
            const channelsIds$ = createUserUpdate$(socket.userId)
                .map(user => user.readChannels);

            return message$
                .withLatestFrom(
                    channelsIds$,
                    (message, channelsIds) => channelsIds.includes(message.channelId) ? [message] : []
                )
                .filter(messages => messages.length)
                .do(emitAction(socket, S2C_SEND_MESSAGES))
        })
        .subscribe(
            createDebugObserver('pushNewMessages')
        )
}

export function pushLatestMessages(db$, socket$) {
    socket$
        .flatMap(socket => db$
            .flatMap(getUser(socket.userId))
            .map(user => user.readChannels)
            .flatMap(channelsIds => db$
                .flatMap(db => findLatestInChannels(db, channelsIds))
            )
            .do(emitAction(socket, S2C_SEND_MESSAGES))
        )
        .subscribe(
            createDebugObserver('pushLatestMessages')
        )
    ;
}

export function handleIncomingMessages(db$, actions$) {
    return actions$
        .filter(action => action.type === C2S_SEND_MESSAGE)
        .map(action => merge(
            {userId: action.userId},
            action.payload
        ))
        .flatMap(validMessage$(getUser, db$))
        .withLatestFrom(
            db$,
            (message, db) => persistMessage(db, message)
        )
        .flatMap(result => result)
        .subscribe(
            createDebugObserver('handleIncomingMessages')
        );
}