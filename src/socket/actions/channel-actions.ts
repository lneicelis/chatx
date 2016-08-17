import {createDebugObserver} from '../../utils/debug-observer';
import {getUser} from '../../repositories/user-repository';
import {findChannels} from '../../repositories/channels-repository';
import {S2C_SEND_CHANNELS} from '../action-types';


// TODO: flatMap user changes until socket disconnect
export function pushChannels(db$, socket$) {
    socket$
        .flatMap(socket => db$
            .flatMap(getUser(socket.userId))
            .map(user => [
                ...user.readChannels,
                ...user.writeChannels
            ])
            .flatMap(channelsIds => db$
                .flatMap(db => findChannels(db, channelsIds))
            )
            .do(channels => socket.emit(S2C_SEND_CHANNELS, channels))
        )
        .subscribe(
            createDebugObserver('pushChannels')
        )
    ;
}