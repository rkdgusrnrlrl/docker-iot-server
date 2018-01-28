let mongoose = require('mongoose')

const Sensor = mongoose.model('sensor', { date: Date, temp : Number ,hum: Number })
module.exports = Sensor