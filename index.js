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
const courses = require('./courses');
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
// Syntax: (path, router object that we imported)
app.use('/api/courses', courses);

/**
 * Configuration
 */
debug(`Application Name: ${config.get('name')}`);
debug(`Application Name: ${config.get('mail.host')}`);
debug(`Application Name: ${config.get('mail.password')}`);

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