const express = require('express')
const db = require('./queries')
require('log-timestamp')

const app = express()
const port = 3000

app.use(express.json())

app.get('/api/vi', db.getVis)
app.post('/api/vi', db.createVis)

app.use(express.static('frontend'))

app.get('/doc', (req, res) => {
	res.sendFile('/home/ec2-user/labview_docs/frontend/doc.html')
})

app.listen(port, () => {
	console.log('starting server on port ' + port)
})
