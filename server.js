const dotenv = require("./utils/dotenvInit");
const connectDB = require("./config/db");
const expressApi = require("./IO_Mangers/ApiManger/expressApi");


const PORT = process.env.PORT || 5000;


const server = expressApi(PORT);

connectDB();


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`error: ${err.message}`);

    server.close();
    process.exit(1)
})
