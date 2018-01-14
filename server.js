const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))


let port = process.env.PORT || (process.argv[2] || 3000);
port = (typeof port === "number") ? port : 3000;

if (!module.parent) { app.listen(port) }
console.log(`Example app Klistening on port ${port}!`)


module.exports = app;