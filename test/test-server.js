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
                expect(res.body.errors).to.have.lengthOf(2)

                expect(res.body.errors).include.a.item.with.property("temp", "REQUIRE")
                expect(res.body.errors).include.a.item.with.property("hum", "REQUIRE")

                done()
            })
            .catch(done)
    })
})