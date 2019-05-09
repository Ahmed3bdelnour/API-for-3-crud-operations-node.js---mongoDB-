const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course');

const { check } = require('express-validator/check');

router.post('/', [
    check('code').exists().withMessage('code can not be empty')
        .isLength({ max: 5 }).withMessage('max length of code is 5 chars').trim(),
    check('title').exists().withMessage('title can not be empty')
        .isLength({ max: 10 }).withMessage('max length of title is 10 chars').trim(),
    check('totalDegree').isInt().withMessage('total degree must be an integer number').trim(),
    check('departments.*').isMongoId().withMessage('department id should sent in mongo id format').trim()
], courseController.postCourse);

router.get('/', courseController.getCourses);

router.get('/:id', courseController.getCourse);

router.put('/:id', [
    check('code').exists().withMessage('code can not be empty')
        .isLength({ max: 5 }).withMessage('max length of code is 5 chars').trim(),
    check('title').exists().withMessage('title can not be empty')
        .isLength({ max: 10 }).withMessage('max length of title is 10 chars').trim(),
    check('totalDegree').isInt().withMessage('total degree must be an integer number').trim(),
    check('departments.*').isMongoId().withMessage('department id should sent in mongo id format').trim()
] ,courseController.putCourse);

router.delete('/:id', courseController.deleteCourse);

module.exports = router;