/**
 * Dependencies
 */
const express = require('express');
const router = express.Router(); // returns a router object

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
router.get('/', (req, res) => {
    res.send(myCourses);
});
router.get('/:id', (req, res) => {
    const course = myCourses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found :(');
    res.send(course);
});

/**
 * POST
 */
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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
 * Export the router
 * Allows access to the endpoints
 * in this file
 */
module.exports = router;