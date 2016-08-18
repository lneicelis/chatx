import {createDebugObserver} from '../../utils/debug-observer';
import {socketDisconnected} from '../../observables/socket';
import {userUpdate$Factory} from '../../repositories/user-repository';
import {findChannels} from '../../repositories/channels-repository';
import {emitAction, S2C_SEND_CHANNELS} from '../action-types';


// TODO: flat map not user but only user channels and distinct until changed
export function pushChannels(db$, socket$) {
    socket$
        .flatMap(socket => db$
            .flatMap(db => {
                return userUpdate$Factory(socket.userId, db)
                    .takeUntil(socketDisconnected(socket))
            })
            .map(user => [
                ...user.readChannels,
                ...user.writeChannels
            ])
            .flatMap(channelsIds => db$
                .flatMap(db => findChannels(db, channelsIds))
            )
            .do(emitAction(socket, S2C_SEND_CHANNELS))
        )
        .subscribe(
            createDebugObserver('pushChannels')
        )
    ;
}