import {findChannel, createChannel, updateChannel, deleteChannel} from "../../repositories/channels-repository";

export function getChannel(req) {
    return findChannel(req.params.channelId);
}

export function createChannel(req) {
    const data = req.body;

    return createChannel(data)
        .then(result => ({
            channelId: result.generated_keys[0]
        }));
}

export function updateChannel(req) {
    const channelId = req.params.channelId;
    const data = req.body;

    return updateChannel(channelId, data)
        .then(result => findChannel(channelId));
}

export function deleteChannel(req) {
    const channelId = req.params.channelId;

    return deleteChannel(channelId)
        .then(() => {});
}