const Course = require("../models/course");
const Department = require("../models/department");

const { validationResult } = require("express-validator/check");

exports.postCourse = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: errors.array(),
      });
    }

    // validationResult(req).throw();

    const { code, title, totalDegree, departments } = req.body;

    const course = new Course({
      code: code,
      title: title,
      totalDegree: totalDegree,
      departments: departments,
    });

    course.save();

    course.departments.forEach(async (departmentId) => {
      // Department.findById(departmentId).then(department => {
      //     department.courses.push(course);
      //     department.save();
      // }).catch(err => {
      //     next(err);
      // });

      const department = await Department.findById(departmentId);
      department.courses.push(course);
      department.save();
    });

    res.json({
      success: true,
      message: "course created successfully",
      course: course,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();

    res.json({
      success: true,
      message: "courses fetched successfully",
      courses: courses,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "course not found",
      });
    }

    res.json({
      success: true,
      message: "course fetched successfully",
      course: course,
    });
  } catch (err) {
    next(err);
  }
};

exports.putCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        message: errors.array(),
      });
    }

    // validationResult(req).throw();

    const courseId = req.params.id;

    const { code, title, totalDegree, departments } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "course not found",
      });
    }

    // remove old array of courses from departments
    course.departments.forEach(async (departmentId) => {
      const department = await Department.findById(departmentId);
      department.courses.splice(department.courses.indexOf(course._id), 1);
      department.save();
    });

    //edit the course
    course.code = code;
    course.title = title;
    course.totalDegree = totalDegree;
    course.departments = departments;

    course.save();

    //add the course to new  departments
    course.departments.forEach(async (departmentId) => {
      const department = await Department.findById(departmentId);
      department.courses.push(course._id);
      department.save();
    });

    res.json({
      success: false,
      message: "course updated successfully",
      updatedCourse: course,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "course not found",
      });
    }

    //delete course from its departments
    course.departments.forEach(async (departmentId) => {
      const department = await Department.findById(departmentId);
      department.courses.splice(department.courses.indexOf(course._id), 1);
      department.save();
    });

    //remove the course
    await Course.findByIdAndRemove(courseId);

    res.json({
      success: true,
      message: "course deleted successfully",
      deletedCourse: course,
    });
  } catch (err) {
    next(err);
  }
};
