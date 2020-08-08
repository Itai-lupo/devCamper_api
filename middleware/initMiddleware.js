const express = require("express");

const logger = require("./logger");
const errorHandler = require("./error");

//route files
const bootcamps = require('../routes/bootcamps');

function initMiddleware(app)
{
    app.use(express.json());

    if(process.env.NODE_ENV === 'development') app.use(logger);
    
    initRoutesMiddleware(app);
    app.use(errorHandler);
    
    app.get('/', (_req, res) => {
        res.send('Hello from express');
    })    
}

function initRoutesMiddleware(app)
{
    app.use('/api/v1/bootcamps', bootcamps);

}

module.exports = initMiddleware; 