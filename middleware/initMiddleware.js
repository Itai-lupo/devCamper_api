const express = require("express");

const logger = require("./logger");
const errorHandler = require("./error");

//route files
const bootcamps = require('../routes/bootcamps');
const courses = require('../routes/coures');

function initMiddleware(app)
{
    app.use(express.json());

    if(process.env.NODE_ENV === 'development') app.use(logger);
    
    initRoutesMiddleware(app);
    app.use(errorHandler);
    
      
}

function initRoutesMiddleware(app)
{
    app.use('/api/v1/bootcamps', bootcamps);
    app.use('/api/v1/courses', courses);
}

module.exports = initMiddleware; 