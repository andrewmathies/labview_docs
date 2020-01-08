const Pool = require('pg').Pool
const fs = require('fs')
const crypto = require('crypto')

const db_user = 'qa_admin'
const db_pwd = fs.readFileSync('db_pwd', 'utf8').trim()
//const encrypted_pwd = 'md5' + crypto.createHash('md5').update(db_pwd + db_user).digest('hex')

const pool = new Pool({
	user: db_user,
	database: 'labview_docs',
	password: db_pwd,
	port: 5432,
})

const getVis = (req, res) => {
	console.log('Recieved get: ' + JSON.stringify(req.body))
	
    pool.query('SELECT * FROM vis ORDER BY id ASC', (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ 'Result': 'Failure' })
        }

        res.status(200).json(result.rows)
    })
}

const createVis = (req, res) => {
	console.log('Recieved post: ' + JSON.stringify(req.body))
	let count = 0	
	
	for (i in req.body) {
		vi = req.body[i]
		pool.query('INSERT INTO vis(name, description) VALUES($1, $2) ON CONFLICT (name) DO NOTHING', [vi.Name, vi.Description], (err, result) => {
			if (err) {
				console.log(err)
            	res.status(500).json({ 'Result': 'Failure' })
            	return
			}

			count++

			if (count == req.body.length) {
				res.status(201).json({ 'Result': 'Inserted ' + result.rowCount + ' new rows' })
			}
    	})
	}
}

module.exports = {
    getVis,
    createVis
}
