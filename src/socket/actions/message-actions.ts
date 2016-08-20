import {merge, curry} from 'ramda';
import {Observable} from 'rx';
import {createDebugObserver} from '../../utils/debug-observer';
import {emitAction, C2S_SEND_MESSAGE, S2C_SEND_MESSAGES} from '../action-types';
import {getUser, createUserUpdate$} from '../../repositories/user-repository';
import {persistMessage, findLatestInChannels} from '../../repositories/message-repository';

export const validMessage$ = curry(
    (getUser, message) => {
        return getUser(message.userId)
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
        .flatMap(socket => getUser(socket.userId)
            .map(user => user.readChannels)
            .flatMap(readChannelsIds => findLatestInChannels(readChannelsIds))
            .do(emitAction(socket, S2C_SEND_MESSAGES))
        )
        .subscribe(
            createDebugObserver('pushLatestMessages')
        );
}

export function handleIncomingMessages(db$, actions$) {
    return actions$
        .filter(action => action.type === C2S_SEND_MESSAGE)
        .map(action => merge(
            {userId: action.userId},
            action.payload
        ))
        .flatMap(validMessage$(getUser))
        .flatMap(persistMessage)
        .subscribe(
            createDebugObserver('handleIncomingMessages')
        );
}