import { IAPIManager } from "./IAPIManager";
import express from "express";
import { Server } from "http";


import logger from "../../middleware/logger";
import errorHandler from "../../middleware/error";

//routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/coures');


export default class expressApi implements IAPIManager
{

	private server: Server;
	private app;

    constructor(port: number)
    {
        this.app = express();

        this.initMiddleware();


        const server = this.app.listen(
            port,
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
        );


        this.server = server;
    }

    private initMiddleware(): void
    {
        this.app.use(express.json());

        if(process.env.NODE_ENV === 'development') this.app.use(logger);
        
        this.initRoutesMiddleware();
        this.app.use(errorHandler);
        
        
    }

    private initRoutesMiddleware(): void
    {
        this.app.use('/api/v1/bootcamps', bootcamps);
        this.app.use('/api/v1/courses', courses);
    }

    close(): void {
        this.server.close();
    }
}

module.exports = expressApi;