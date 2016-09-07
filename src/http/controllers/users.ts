import {findUser, updateUser, createUser, deleteUser} from '../../repositories/user-repository';
import {sign} from '../../utils/auth';

export function generateToken(req) {
    return findUser(req.params.userId)
        .flatMap(user => {
            const accessToken = sign(user.id);

            return updateUser(user.id, {accessToken})
                .then(() => ({accessToken}));
        });
}

export function getUser(req) {
    return findUser(req.params.userId);
}

export function createUser(req) {
    const data = req.body;

    return createUser(data)
        .then(result => ({
            userId: result.generated_keys[0]
        }));
}

export function updateUser(req) {
    const userId = req.params.userId;
    const data = req.body;

    return updateUser(userId, data)
        .then(result => findUser(userId));
}

export function deleteUser(req) {
    const userId = req.params.userId;

    return deleteUser(userId)
        .then(() => {});
}