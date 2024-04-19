const express = require('express');
const router = express.Router();

const client = require('../db');

const title = 'Todo App';

/* GET home page. */
router.get('/', async (req, res, next) => {
	client.query('SELECT * FROM todos ORDER BY id ASC', (err, result) => {
		if (err) console.error('Error fetching todos:', err.message);
		else res.render('index', { title, todos: result.rows });
	});
});

/* CREATE Todo */
router.post('/', (req, res) => {
	client.query(
		'INSERT INTO todos ( title ) VALUES ( $1 )',
		[req.body.title],
		(err, result) => {
			if (err) console.error('Error creating todo:', err.message);
			else res.redirect('/');
		}
	);
});

/* TOGGLE Todo */
router.get('/toggle/:id', (req, res) => {
	// fetch the todo
	client.query(
		'SELECT * FROM todos WHERE id=$1',
		[req.params.id],
		(err, result) => {
			if (err) console.error('Error fetching todo:', err.message);
			else {
				const todo = result.rows[0];

				// update the todo
				client.query(
					'UPDATE todos SET done=$1 WHERE id=$2',
					[!todo.done, req.params.id],
					(err, result) => {
						if (err) console.error('Error updating todo:', err.message);
						else res.redirect('/');
					}
				);
			}
		}
	);
});

/* DELETE a Todo */
router.get('/delete/:id', (req, res) => {
	client.query(
		'DELETE FROM todos WHERE id=$1',
		[req.params.id],
		(err, result) => {
			if (err) console.error('Error deleting todo:', err.message);
			else res.redirect('/');
		}
	);
});

module.exports = router;
