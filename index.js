const express = require('express')
const db = require('./queries')
require('log-timestamp')

const app = express()
const port = 3000

app.use(express.json())

app.get('/api/vi', db.getVis)
app.post('/api/vi', db.createVis)

app.get('/', (req, res) => {
	res.sendFile('./frontend/index.html')
})

app.get('/doc', (req, res) => {
	res.sendFile('./frontend/doc.html')
})

app.listen(port, () => {
	console.log('starting server on port ' + port)
})
