/**
 * Created by rkdgusrnrlrl on 18. 1. 14.
 */
const request = require('supertest');
const app = require('../server');
const chai = require('chai');
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
    })
})