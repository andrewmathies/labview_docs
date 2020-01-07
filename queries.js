const Pool = require('pg').Pool
const fs = require('fs')
const crypto = require('crypto')

const db_pwd = fs.readFileSync('db_pwd', 'utf8')

const pool = new Pool({
	user: 'other_user',
	database: 'labview_docs',
	password: db_pwd,
	port: 5432,
})

const fill_temp_table = (vi_list, res) => {
	let count = 0

	for (i in vi_list) {
		vi = vi_list[i]		

		pool.query('INSERT INTO temp_data(name, description) VALUES($1, $2)', [vi.Name, vi.Description], (err, result) => {
			if (err) {
				console.log(err)
                res.status(500).json({ 'Result': 'Failure' })
                return
			}
			
			count += 1
			if (count == vi_list.length) {
				distinct_insert(res)
			}
		})
	}
}

const distinct_insert = (res) => {
	pool.query('INSERT INTO vis(name, description) SELECT DISTINCT name, description FROM temp_data WHERE NOT EXISTS (SELECT \'X\' FROM vis WHERE temp_data.name = vis.name AND temp_data.description = vis.description)', (err, result) => {
		if (err) {
			console.log(err)
            res.status(500).json({ 'Result': 'Failure' })
            return
		}
		
		res.status(201).json({ 'Result': 'Success' })	
	})
}

const getVis = (req, res) => {
    pool.query('SELECT * FROM vis ORDER BY id ASC', (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ 'Result': 'Failure' })
        }

        res.status(200).json(result.rows)
    })
}

const createVis = (req, res) => {
	console.log('Recieved post:')
	console.log(req.body)

	pool.query('CREATE TEMPORARY TABLE temp_data(name VARCHAR(30), description VARCHAR(200))', (err, result) => {
		if (err) {
			console.log(err)
            res.status(500).json({ 'Result': 'Failure' })
            return
		}

		fill_temp_table(req.body, res)
    })
}

module.exports = {
    getVis,
    createVis
}
