var superagent = require('supertest');
import * as assert from 'assert';
import {createApp} from '../../../http/server';
import {r, loadFixtures, truncateTables} from '../../utils/database';
import * as config from '../../../config';

const secret = config.default.api.secret;

describe('Users API Routes', function () {
    const userId = 'longLongFakeId';
    const API = superagent(createApp());

    beforeEach(done => {
        loadFixtures('users', {
            id: userId,
            username: 'fixture'
        }).then(done);
    });

    describe('GET /users/:userId', () => {
        it('requires secret token', done => {
            API.get(`/users/${userId}`)
                .expect(401)
                .end(done);
        });

        it('should return 200 and should return 1 user', done => {
            API.get(`/users/${userId}`)
                .set('Authorization', secret)
                .expect(200)
                .end(function (err, res) {
                    assert(res.body.id === userId);
                    done();
                })
            ;
        });
    });

    describe('POST /users', () => {
        it('requires secret token', done => {
            API.post('/users')
                .send({username: 'test1'})
                .expect(401)
                .end(done)
            ;
        });

        it('creates new user', done => {
            API.post('/users')
                .set('Authorization', secret)
                .send({
                    username: 'test1'
                })
                .expect(200)
                .end((err, res) => {
                    assert(res.body.userId.length === 36);
                    done();
                })
            ;
        });
    });

    describe('PATCH /users/:userId', function () {
        it('requires secret token', function (done) {
            API.patch('/users/' + userId)
                .expect(401)
                .end(done)
            ;
        });

        it('updates user properties', function (done) {
            API.patch('/users/' + userId)
                .set('Authorization', secret)
                .send({
                    readChannels: ['test2']
                })
                .expect(200)
                .end((err, res) => {
                    r.table('users').get(userId).run().then(user => {
                        setTimeout(() => {
                            assert(user.readChannels[0] === 'test2');

                            done();
                        }, 100);
                    });
                })
            ;
        });
    });

    describe('DELETE /users/:userId', () => {
        it('requires secret token', done => {
            API.delete('/users/' + userId)
                .expect(401)
                .end(done)
            ;
        });

        it('should return 200', done => {
            API.delete('/users/' + userId)
                .set('Authorization', secret)
                .expect(200)
                .end((err, res) => {
                    r.table('users').count().run().then(count => {
                        assert(count === 0);
                        done();
                    });
                })
            ;
        });
    });

    describe('GET /users/:userId/access-token', () => {
        it('requires secret token', done => {
            API.get('/users/' + userId + '/access-token')
                .expect(401)
                .end(done)
            ;
        });

        it('responds with {accessToken: "string"}', function (done) {
            API.get('/users/' + userId + '/access-token')
                .set('Authorization', secret)
                .expect(200)
                .end((err, res) => {
                    assert(typeof res.body.accessToken === 'string');
                    done();
                })
            ;
        });
    });
});