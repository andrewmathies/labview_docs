const Pool = require('pg').Pool
const fs = require('fs')

// We read the database password from a file that is ignored by github so the password isn't stored in the publicly available repo.
const db_user = 'qa_admin'
const db_name = 'labview_docs'
const db_pwd = fs.readFileSync('db_pwd', 'utf8').trim()

const pool = new Pool({
	user: db_user,
	database: db_name,
	password: db_pwd,
	port: 5432,
})

// This function corresponds to the /api/vi/ endpoint. It returns all rows in the vis table sorted alphabetically.
const getVis = (req, res) => {
	console.log('Recieved get request for all vis')

	pool.query('SELECT * FROM vis ORDER BY name ASC', (err, result) => {
		if (err) {
			console.log(err)
			res.sendStatus(500)
			return
		}

		res.status(200).json(result.rows)
	})
}

/*
This function corresponds to the /api/vi/:id endpoint. It returns the row in the vis table with a specified ID.
If no such row exists, it returns status code 204 No Content.
*/
const getVi = (req, res) => {
	console.log('Recieved get request for vi with id: ' + req.params.id)

	pool.query('SELECT * FROM vis WHERE id=($1)', [req.params.id], (err, result) => {
		if (err) {
			console.log(err)
			res.sendStatus(500)
			return
		}

		if (result.rowCount == 0) {
			res.sendStatus(204)
			return
		}

		res.status(200).json(result.rows)
	})
}

// This function corresponds to the /api/vi/ endpoint. It creates entries in the vis table for each element in the list it recieves in the body.
const createVis = (req, res) => {
	console.log('Recieved post request with: ' + req.body.length + ' vis')

	let count = 0
	let resultCount = 0

	for (i in req.body) {
		vi = req.body[i]

		if (vi.Name.length > MAX_NAME_LEN) {
			console.log('recieved vi with name that\'s too long: ' + vi.Name)
			vi.Name = vi.Name.substring(0, 49)
		}

		pool.query('INSERT INTO vis(name, description) VALUES($1, $2) ON CONFLICT (name) DO NOTHING', [vi.Name, vi.Description], (err, result) => {
			if (err) {
				console.log(err)
				res.sendStatus(500)
				return
			}

			count++
			resultCount += result.rowCount

			if (count == req.body.length) {
				res.status(201).json({ 'Result': 'Inserted ' + resultCount + ' new rows' })
			}
		})
	}
}

module.exports = {
	getVis,
	getVi,
	createVis
}
