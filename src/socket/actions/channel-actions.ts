import {createDebugObserver} from '../../utils/debug-observer';
import {socketDisconnected} from '../../observables/socket';
import {userUpdate$Factory} from '../../repositories/user-repository';
import {findChannels} from '../../repositories/channels-repository';
import {emitAction, S2C_SEND_CHANNELS} from '../action-types';

export const pushChannels = pushChannelsFactory(
    userUpdate$Factory,
    socketDisconnected,
    findChannels
);

// TODO: flat map not user but only user channels and distinct until changed
export function pushChannelsFactory(userUpdate$Factory, socketDisconnected, findChannels) {
    return function pushChannels(socket$) {
        socket$
            .flatMap(socket => userUpdate$Factory(socket.userId)
                .takeUntil(socketDisconnected(socket))
                .map(user => [
                    ...user.readChannels,
                    ...user.writeChannels
                ])
                .flatMap(channelsIds => findChannels(channelsIds))
                .do(emitAction(socket, S2C_SEND_CHANNELS))
            )
            .subscribe(
                createDebugObserver('pushChannels')
            );
    }
}