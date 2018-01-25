/**
 * Created by rkdgusrnrlrl on 18. 1. 14.
 */
const request = require('supertest');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;

describe('server start test', function() {
    it('/ is "Hello World!"', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .then((res) => {
                expect(res.text).to.be.equal("Hello World!")
                done()
            })
            .catch(done)
    })

    it('POST /air-status is ok', function(done) {
        request(app)
            .post('/air-status')
            .set('Accept', 'application/json')
            .send({temp : 17, hum : 55})
            .expect(200)
            .then((res) => {
                expect(res.body.ok).to.be.equal(true)
                done()
            })
            .catch(done)
    })

    it('POST /air-status is ok', function(done) {
        request(app)
            .post('/air-status')
            .set('Accept', 'application/json')
            .expect(400)
            .then((res) => {

                const errors = res.body.errors;
                expect(errors).to.have.lengthOf(2)

                expect(errors).include.a.item.with.property("temp", "REQUIRE")
                expect(errors).include.a.item.with.property("hum", "REQUIRE")

                done()
            })
            .catch(done)
    })

    it('POST /air-status save data', async function() {
        const Docker = require('dockerode');
        const docker = new Docker({
            socketPath: '/var/run/docker.sock'
        });

        const container = await docker.createContainer({
            Image : "mongo",
            ExposedPorts: {
                "27017/tcp": {}
            },
            HostConfig : {
                "PortBindings": { "27017/tcp": [{ "HostPort": "27017" }] },
            }
        })
        await container.start()

        await request(app)
            .post('/air-status')
            .set('Accept', 'application/json')
            .send({temp : 17, hum : 55})
            .expect(200)

        const mongoose = require('mongoose')
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/iot', { useMongoClient: true })

        const Sencer = mongoose.model('sencer', {  temp : Number ,hum: Number })
        const sencerDataList = await Sencer.find({}).lean().exec();

        expect(sencerDataList).to.have.lengthOf(1)

        mongoose.disconnect()

        await container.remove({force : true})
    })

})