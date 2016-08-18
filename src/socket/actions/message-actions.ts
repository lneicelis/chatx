import {merge, curry} from 'ramda';
import {Observable} from 'rx';
import {createDebugObserver} from '../../utils/debug-observer';
import {C2S_SEND_MESSAGE, S2C_SEND_MESSAGES} from '../action-types';
import {getUser} from '../../repositories/user-repository';
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

export function pushLatestMessages(db$, socket$) {
    socket$
        .flatMap(socket => db$
            .flatMap(getUser(socket.userId))
            .map(user => [
                ...user.readChannels,
                ...user.writeChannels
            ])
            .flatMap(channelsIds => db$
                .flatMap(db => findLatestInChannels(db, channelsIds))
            )
            .do(messages => socket.emit(S2C_SEND_MESSAGES, messages))
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