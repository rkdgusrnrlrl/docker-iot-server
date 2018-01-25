/**
 * Created by rkdgusrnrlrl on 18. 1. 14.
 */
const Docker = require('dockerode');


describe('mongo docker test', async function() {
    let mongoContainer;
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
    })

    it('save document', async function() {

        const mongoose = require('mongoose')
        mongoose.connect('mongodb://localhost/test', { useMongoClient: true })
        mongoose.Promise = global.Promise

        const Cat = mongoose.model('Cat', { name: String })
        const kitty = new Cat({ name: 'Zildjian' })
        await kitty.save()

        mongoose.disconnect()

    })

    after("remove mongoContainer", async function () {
        await mongoContainer.remove({force :true})
    })
})