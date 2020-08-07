const dotenv = require("./utils/dotenvInit");
const express = require("express");
const initMiddleware = require("./middleware/initMiddleware");
const connectDB = require("./config/db");



const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
initMiddleware(app);


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`error: ${err.message}`);

    server.close(() => process.exit(1));
})
