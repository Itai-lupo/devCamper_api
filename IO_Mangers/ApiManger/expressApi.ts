import IAPIManager from "./IAPIManager";
import express = require("express");
import { Server } from "http";


import logger from "./middleware/logger";
import errorHandler from "./middleware/error";

 
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
        
        this.app.use(errorHandler);
        
        
    }

    public addRoute(method:string, path: string, functionToCall: (req: any, res: any, next: any) => void )
    {
        this.app[method](path, functionToCall);
    }

    close(): void {
        this.server.close();
    }
}
