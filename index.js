/**
 * Dependancies
 */
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
    // New course object
    const course = {
        id: myCourses.length + 1,
        // We assume there is an object called body with the name property
        name: req.body.name
    };
    myCourses.push(course);
    res.send(course);
});

/**
 * Start listening
 */
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));