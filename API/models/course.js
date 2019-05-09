const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = new Schema({
    code: {type: String, required: true},
    title: {type: String, required: true},
    totalDegree: {type: Number, required: true},
    departments:[{type: Schema.Types.ObjectId, ref: 'Department'}] 
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;


