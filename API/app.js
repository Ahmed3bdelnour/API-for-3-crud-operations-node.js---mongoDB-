const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const studentRoutes = require('./routes/student');
const departmentRoutes = require('./routes/department');
const courseRoutes = require('./routes/course');



app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());



app.use('/students', studentRoutes);
app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);


app.use((err, req, res, next)=>{
    res.json({
        success: false,
        message: err.message
    });
});


mongoose.connect('mongodb://127.0.0.1:27017/crud', { useNewUrlParser: true }).then(() => {
    console.log('connected to data base successfully');

    app.listen(3000, (err)=>{
        if(err) return console.log(err);
        console.log('server is listening on http://localhost:3000');
    });

}).catch(err => {
    console.log(err);
    process.exit(1);
});