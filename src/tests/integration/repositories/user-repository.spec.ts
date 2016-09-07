process.env.DB_NAME = 'chatx_test';

import * as assert from 'assert';
import {loadFixtures} from '../../utils/database';
import {findUser} from '../../../repositories/user-repository';

describe('findUser', () => {
    beforeEach(done => {
        loadFixtures('users', [
            {
                id: 'testId',
                username: 'test_user'
            }
        ]).then(done);
    });

    it('should return user', done => {
        findUser('testId').subscribe({
            onNext: user => {
                assert(
                    user.id === 'testId'
                )
            },
            onCompleted: done
        });
    });
});