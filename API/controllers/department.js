const Department = require('../models/department');
const { validationResult } = require('express-validator/check');

exports.postDepartment = (req, res, next) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                success: false,
                message: errors.array()
            });
        }

        const { name } = req.body;

        const department = new Department({
            name: name
        });

        department.save();

        res.json({
            success: true,
            message: 'department created successfully',
            department: department
        });

    } catch (err) {
        next(err);
    }

}

exports.getDepartments = async (req, res, next) => {
    try {

        const departments = await Department.find().populate('students').exec();

        res.json({
            success: true,
            message: 'departments fetched successfully',
            departments: departments
        });

    } catch (err) {
        next(err);
    }
}


exports.getDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.id;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.json({
                success: false,
                message: 'failed to fetch department'
            });
        }

        res.json({
            success: true,
            message: 'department fetched successfully',
            department: department
        });

    } catch (err) {
        next(err);
    }

}

exports.putDepartment = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                success: false,
                message: errors.array()
            });
        }

        const departmentId = req.params.id;
        const { name } = req.body;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.json({
                success: false,
                message: 'failed to fetch department'
            });
        }

        department.name = name;

        department.save();

        res.json({
            success: true,
            message: 'department updated successfully',
            department: department
        });

    } catch (err) {
        next(err);
    }


}

exports.deleteDepartment = async (req, res, next) => {
    try {
        const departmentId = req.params.id;

        const department = await Department.findById(departmentId);

        if (!department) {
            return res.json({
                success: false,
                message: 'can not find department'
            });
        }

        await Department.findOneAndRemove({_id: departmentId});

        res.json({
            success: true,
            message: 'department deleted successfully',
            department: department
        });

    } catch (err) {
        next(err);
    }
}