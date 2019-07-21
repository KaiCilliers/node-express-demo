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
app.get('/api/courses', (req, res) => {
    res.send(myCourses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = myCourses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found :(');
    res.send(course);
});
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

/**
 * POST
 */
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const course = {
        id: myCourses.length + 1,
        name: req.body.name
    };
    myCourses.push(course);
    res.send(course);
});

/**
 * PUT
 */
app.put('/api/courses/:id', (req, res) => {
    const course = myCourses.find(item => item.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found :(');

    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

/**
 * DELETE
 */
app.delete('/api/courses/:id', (req, res) => {
    const course = myCourses.find(item => item.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found :(');

    const index = myCourses.indexOf(course);
    myCourses.splice(index, 1);

    res.send(course);
});


/**
 * Functions
 */
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

/**
 * Start listening
 */
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));