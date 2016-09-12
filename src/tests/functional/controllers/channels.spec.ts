var superagent = require('supertest');
import * as assert from 'assert';
import {createApp} from '../../../http/server';
import {r, loadFixtures, truncateTables} from '../../utils/database';
import * as config from '../../../config';

const secret = config.default.api.secret;

describe.only('Channels API Routes', function () {
    const channelId = 'longLongFakeId';
    const API = superagent(createApp());

    beforeEach(done => {
        loadFixtures('channels', {
            id: channelId,
            title: 'fixtureTitle'
        }).then(done);
    });

    describe('GET /channels/:channelId', () => {
        it('requires secret token', done => {
            API.get(`/channels/${channelId}`)
                .expect(401)
                .end(done);
        });

        it('should return 200 and should return 1 channel', done => {
            API.get(`/channels/${channelId}`)
                .set('Authorization', secret)
                .expect(200)
                .end((err, res) => {
                    assert(res.body.id === channelId, 'Actual: ' + JSON.stringify(res.body));
                    done();
                })
            ;
        });
    });

    describe('POST /channels', () => {
        it('requires secret token', done => {
            API.post('/channels')
                .send({username: 'test1'})
                .expect(401)
                .end(done)
            ;
        });

        it('creates new channel', done => {
            API.post('/channels')
                .set('Authorization', secret)
                .send({
                    title: 'test1'
                })
                .expect(200)
                .end((err, res) => {
                    assert(res.body.channelId.length === 36, JSON.stringify(res.body));
                    done();
                })
            ;
        });
    });

    describe('PATCH /channels/:channelId', function () {
        it('requires secret token', function (done) {
            API.patch('/channels/' + channelId)
                .expect(401)
                .end(done)
            ;
        });

        it('updates user properties', function (done) {
            API.patch('/channels/' + channelId)
                .set('Authorization', secret)
                .send({
                    title: 'title update'
                })
                .expect(200)
                .end((err, res) => {
                    r.table('channels').get(channelId).run().then(channel => {
                        assert(channel.title === 'title update', JSON.stringify(res));

                        done();
                    });
                })
            ;
        });
    });

    describe('DELETE /channels/:channelId', () => {
        it('requires secret token', done => {
            API.delete('/channels/' + channelId)
                .expect(401)
                .end(done)
            ;
        });

        it('should return 200', done => {
            API.delete('/channels/' + channelId)
                .set('Authorization', secret)
                .expect(200)
                .end((err, res) => {
                    r.table('channels').count().run().then(count => {
                        assert(count === 0);
                        done();
                    });
                })
            ;
        });
    });
});