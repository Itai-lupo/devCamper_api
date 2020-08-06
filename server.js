const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//route files
const bootcamps = require('./routes/bootcamps');

dotenv.config({path: './config/config.env'});
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development') app.use(logger);

app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Hello from express');
})


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`error: ${err.message}`);

    server.close(() => process.exit(1));
})