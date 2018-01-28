const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'))

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/iot', { useMongoClient: true })
mongoose.Promise = global.Promise
const Sensor = require("./db/models/Sensor")



app.post('/air-status', async (req, res) => {

    const temp = parseInt(req.body.temp, 10)
    const hum = parseInt(req.body.hum, 10)

    let errors = [];
    if (isNaN(temp)) errors.push({temp : "REQUIRE"})
    if (isNaN(hum)) errors.push({hum : "REQUIRE"})
    if(errors.length > 0) return res.status(400).json({ errors : errors })
    const now = new Date()

    const sensor = new Sensor({date: now, temp : temp, hum : hum});
    await sensor.save()

    res.json({ok : true})
})


let port = process.env.PORT || (process.argv[2] || 3000)
port = (typeof port === "number") ? port : 3000

if (!module.parent) { app.listen(port) }
console.log(`Example app Klistening on port ${port}!`)




module.exports = app