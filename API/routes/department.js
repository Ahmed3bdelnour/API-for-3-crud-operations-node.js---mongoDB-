const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/department');

const { check } = require('express-validator/check');

router.post('/',[
    check('name').exists().withMessage('department name is required')
], departmentController.postDepartment);

router.get('/', departmentController.getDepartments);
router.get('/:id', departmentController.getDepartment);

router.put('/:id',[
    check('name').exists().withMessage('department name is required')
], departmentController.putDepartment);

router.delete('/:id', departmentController.deleteDepartment);



module.exports = router;