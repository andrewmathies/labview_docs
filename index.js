const express = require('express')
const db = require('./queries')
require('log-timestamp')

const app = express()
const port = 80

app.use(express.json({ limit: '50mb' }))
app.use(express.static('frontend'))

app.get('/api/vi', db.getVis)
app.get('/api/vi/:name', db.getVi)
app.post('/api/vi', db.createVis)

app.listen(port, () => {
	console.log('starting server on port ' + port)
})
