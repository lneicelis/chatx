import {createDebugObserver} from '../../utils/debug-observer';
import {getUser} from '../../repositories/user-repository';
import {findChannels} from '../../repositories/channels-repository';


// TODO: flatMap user changes until socket disconnect
export function pushChannels(db$, socket$) {
    socket$
        .flatMap(socket => {
            return db$.flatMap(getUser(socket.userId))
        })
        .flatMap(user => {
            const channelsIds = [
                ...user.readChannels,
                ...user.writeChannels
            ];

            return db$.flatMap(findChannels(channelsIds))
        })
        .subscribe(
            createDebugObserver('pushChannels')
        )
    ;
}