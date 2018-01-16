/**
 * Created by rkdgusrnrlrl on 18. 1. 14.
 */
const chai = require('chai');
const expect = chai.expect;
const Docker = require('dockerode');

describe('dockerode', function() {

    it('/ is "Hello World!"', async function() {
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

        await container.remove({force : true})

    }).timeout(10000)
})