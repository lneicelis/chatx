process.env.DB_NAME = 'chatx_test';

import * as assert from 'assert';
import {loadFixtures} from '../../utils/database';
import {getUser} from '../../../repositories/user-repository';

describe('getUser', () => {
    beforeEach(done => {
        loadFixtures('users', [
            {
                id: 'testId',
                username: 'test_user'
            }
        ]).then(done);
    });

    it('should return user', done => {
        getUser('testId').subscribe({
            onNext: user => {
                assert(
                    user.id === 'testId'
                )
            },
            onCompleted: done
        });
    });
});