const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger")

//route files
const bootcamps = require('./routes/bootcamps');

dotenv.config({path: './config/config.env'});

const app = express();
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'development') app.use(logger);

app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
    res.send('Hello from express');
})


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));