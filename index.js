/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const logger = require('./logger');
const authenticator = require('./auth');
const express = require('express');
const app = express();

/**
 * Middleware
 * 
 * A request goes through these
 * sequentially.
 * 
 * Request Processing Pipeline
 * app.use() installs a new midldeware
 */
app.use(express.json());
// convert key=value pairs to json
app.use(express.urlencoded());
/**
 * [next] has a reference to the
 * next middleware function.
 */
app.use(logger);
app.use(authenticator);

/**
 * Array
 */
const myCourses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];


/**
 * GET - fetch data
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
    //res.send(req.query);
});

/**
 * POST
 * 
 * Create new entry
 * Ensure the path is correct format
 */
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // New course object
    const course = {
        id: myCourses.length + 1,
        // We assume there is an object called body with the name property
        name: req.body.name
    };
    // Add the new course obj to list
    myCourses.push(course);
    // Send the new object back to user
    res.send(course);
});

/**
 * PUT
 * 
 * Update an existing item
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
    // Go to the index and delete 1 object
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