/**
 * Dependencies
 */
const express = require('express');
// This approach does not work if you split the routes
// into seperate files
const app = express();

/**
 * GET
 */
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