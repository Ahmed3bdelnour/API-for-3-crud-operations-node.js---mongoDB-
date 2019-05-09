const Student = require('../models/student');
const Department = require('../models/department');
const { validationResult } = require('express-validator/check');

exports.postStudent = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                success: false,
                message: errors.array()
            });
        }

        const { name, age, departmentId } = req.body;

        let department;

        const student = new Student({
            name: name,
            age: age,
            department: departmentId
        });

        if(departmentId){
            department = await Department.findOne({ _id: departmentId });
            department.students.push(student._id);
        }

        // you should save stdent first then save department as depratment is dependent on student
        student.save();

        if(department){
            department.save();
        }

        res.json({
            success: true,
            message: 'student created successfully',
            student: student
        });
    } catch (err) {
        next(err);
    }


};

exports.getStudents = async (req, res, next) => {
    try {
        const students = await Student.find().populate({
            path: 'department'
        }).exec();

        res.json({
            success: true,
            message: 'students fetched successfully',
            students: students
        });
    } catch (err) {
        console.log(err);
    }
};


exports.getStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findOne({ _id: studentId }).populate({
            path: 'department',
            populate: {
                path: 'students'
            }
        }).exec();

        if (!student) {
            return res.json({
                success: false,
                message: 'failed to fetch student'
            });
        };

        res.json({
            success: true,
            message: 'student fetched successfully',
            student: student
        });

    } catch (err) {
        next(err);
    }
};


exports.putStudent = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                success: false,
                message: errors.array()
            });
        }
        

        const studentId = req.params.id;
        const { name, age, departmentId } = req.body;

        let oldDepartment;
        let newDepartment;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.json({
                success: false,
                message: 'can not fetch student to be updated successfully'
            });
        }

        if (student.department.toString() !== departmentId.toString()) {

            oldDepartment = await Department.findById(student.department);
            oldDepartment.students.splice(oldDepartment.students.indexOf(student._id), 1);

            console.log(oldDepartment.students[0]);


            newDepartment = await Department.findById(departmentId);
            newDepartment.students.push(student._id);

            console.log(newDepartment.students[0]);

        }

        student.name = name;
        student.age = age;
        student.department = departmentId;

        student.save();


        if (oldDepartment) {
            oldDepartment.save();
        }
        if (newDepartment) {
            newDepartment.save();
        }

        res.json({
            success: true,
            message: 'student updated successfully',
            updatedStudent: student
        });
    } catch (err) {
        next(err);
    }

}

exports.deleteStudent = async (req, res, next) => {
    try {
        const studentId = req.params.id;

        const student = await Student.findById(studentId);

        if (!student) {
            return res.json({
                success: false,
                message: 'can not fetch student to be deleted'
            });
        }

        const department = await Department.findById(student.department);

        if(department){
            department.students.splice(department.students.indexOf(student._id), 1);
            department.save();
        }
        

        // don't forgot to use await
        await Student.findByIdAndRemove(studentId);

        res.json({
            success: true,
            message: 'student deleted successfully',
            deletedStudent: student
        });

    } catch (err) {
        next(err);
    }


}


