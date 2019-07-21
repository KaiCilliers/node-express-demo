/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const logger = require('./logger');
const authenticator = require('./auth');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
// second parentheses is an argument for a custom namespace
// You are not going to use multiple debuggers in the same file most likely
const debug = require('debug')('app:startup');

const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);
app.use(authenticator);
app.use(helmet());
if(app.get('env') === 'development') {
    app.use(morgan('dev'));
    debug("Morgan enabled...");
}

/**
 * Configuration
 */
debug(`Application Name: ${config.get('name')}`);
debug(`Application Name: ${config.get('mail.host')}`);
debug(`Application Name: ${config.get('mail.password')}`);

/**
 * Array
 */
const myCourses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];

/**
 * GET
 */
app.get('/', (req, res) => {
    res.send('Hello!');
});

/**
 * Start listening
 */
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));