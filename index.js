/**
 * Dependancies
 */
const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

/**
 * Middleware
 * 
 * A request goes through these
 * sequentially.
 * 
 * Request Processing Pipeline
 */
app.use(express.json());

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
    // Joi requires a schema
    const schema = {
        name: Joi.string().min(3).required()
    };

    // Joi validation
    const result = Joi.validate(req.body, schema);

    // Process result
    if(result.error) {
        // Return a 400 response (Bad Request)
        res.status(400).send(result.error.details[0].message);
        return;
    }
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
 * Start listening
 */
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));