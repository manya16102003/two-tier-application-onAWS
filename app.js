require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const client = require('./db');

var app = express();

// connect to DB
client.connect((err) => {
	if (err) console.error('Error connecting to DB:', err.message);
	else {
		console.info('Connected to DB!');
		client.query(
			`
			CREATE TABLE IF NOT EXISTS todos (
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				done BOOLEAN DEFAULT FALSE
			)
		`,
			(err, res) => {
				if (err) console.error('Error creating todos table:', err.message);
				else console.info('Created todos table');
			}
		);
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
