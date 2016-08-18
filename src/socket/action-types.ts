import {curry} from 'ramda';

export const C2S_SEND_MESSAGE = 'C2S_SEND_MESSAGE';
export const C2S_CONNECT_TO_CHANNEL = 'C2S_CONNECT_TO_CHANNEL';

export const S2C_SEND_MESSAGES = 'S2C_SEND_MESSAGES';
export const S2C_SEND_CHANNELS = 'S2C_SEND_CHANNELS';

export const emitAction = curry(
    (socket, actionType, payload) => {
        socket.emit('action', {
            type: actionType,
            payload
        })
    }
);