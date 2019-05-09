const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name:{type: String , required: true},
    courses: [{type: Schema.Types.ObjectId, ref:'Course'}],
    students:[{type: Schema.Types.ObjectId, ref: 'Student'}]
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;