/**
 * Created by rkdgusrnrlrl on 18. 1. 14.
 */
const request = require('supertest');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const Docker = require('dockerode');
const Sensor = require("../db/models/Sensor")

describe('server start test', async function() {

    let mongoContainer;
    let mongoose = require('mongoose')

    function sleep(milliseconds) {
        const start = Date.now()
        while ((Date.now() - start) < milliseconds) {}
    }

    before("", async function() {
        const docker = new Docker({
            socketPath: '/var/run/docker.sock'
        });

        mongoContainer = await docker.createContainer({
            Image : "mongo",
            ExposedPorts: {
                "27017/tcp": {}
            },
            HostConfig : {
                "PortBindings": { "27017/tcp": [{ "HostPort": "27017" }] },
            }
        })
        await mongoContainer.start()
        await mongoContainer.stats();

        sleep(1000)

        mongoose.connect('mongodb://localhost/iot', { useMongoClient: true })
        mongoose.Promise = global.Promise

    })

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

    it('POST /air-status require temp and hum', function(done) {
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

        await request(app)
            .post('/air-status')
            .set('Accept', 'application/json')
            .send({temp : 17, hum : 55})
            .expect(200)


        const sensorDataList = await Sensor.find({}).lean().exec()
        expect(sensorDataList).to.have.not.lengthOf(0)

    }).timeout(10000)

    after("remove mongoContainer", async function () {
        if (mongoose.connection.readyState ===1 || mongoose.connection.readyState ===2) {
            mongoose.disconnect()
        }
        await mongoContainer.remove({force :true})
    })

})