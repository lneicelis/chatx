import {merge, curry} from 'ramda';
import {Observable} from 'rx';
import {createDebugObserver} from '../../utils/debug-observer';
import {emitAction, C2S_SEND_MESSAGE, S2C_SEND_MESSAGES} from '../action-types';
import {findUser, createUserUpdate$} from '../../repositories/user-repository';
import {persistMessage, findLatestInChannels} from '../../repositories/message-repository';

export const validMessage$ = curry(
    (getUser, message) => {
        return getUser(message.userId)
            .map(user => {
                // TODO: strip tags
                if (!Array.isArray(user.writeChannels)) {
                    throw new Error('User write channels is not array!')
                }
                if (!user.writeChannels.includes(message.channelId)) {
                    throw new Error(`User does not have permission to write to channel`)
                }

                return message;
            })
            .catch(error => {
                console.log('Invalid message', error.message, message);

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

export function pushLatestMessages(socket$) {
    socket$
        .flatMap(socket => findUser(socket.userId)
            .map(user => user.readChannels)
            .flatMap(readChannelsIds => findLatestInChannels(readChannelsIds))
            .do(emitAction(socket, S2C_SEND_MESSAGES))
        )
        .subscribe(
            createDebugObserver('pushLatestMessages')
        );
}

export function handleIncomingMessages(actions$) {
    return actions$
        .filter(action => action.type === C2S_SEND_MESSAGE)
        .map(action => merge(
            {userId: action.userId},
            action.payload
        ))
        .flatMap(message => validMessage$(findUser, message))
        .flatMap(message => persistMessage(message))
        .subscribe(
            createDebugObserver('handleIncomingMessages')
        );
}