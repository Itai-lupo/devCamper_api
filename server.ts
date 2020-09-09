require("./utils/dotenvInit");

import expressApi from "./IO_Mangers/ApiManger/expressApi";
import IAPIManagers from "./IO_Mangers/ApiManger/IAPIManager";

import IDBManger from './IO_Mangers/DBManger/IDBManger';
import mangoDBManger from './IO_Mangers/DBManger/mangoDBManger';

import bootcampsLogic from './business logic/bootcampUseCases';
import coursesLogic from './business logic/coursesUseCases'

const PORT: number = parseInt(process.env.PORT) || 5000;


const DBManger: IDBManger = createDBManger();

const APIManger: IAPIManagers = createAPIManger();

const bootcampsManger = new bootcampsLogic(DBManger);
const coursesManger = new coursesLogic(DBManger);


DBManger.connect();
initIOInputRoutes();

process.on("unhandledRejection", (err: any, promise) => {
    if(!err.message) err.message = "server error";
    console.log(`error: ${err.message}`);

    APIManger.close();
    process.exit(1);
})


function createAPIManger()
{
    switch(process.env.SERVER_MANGER_TYPE)
    {
        case("express"):
            return new expressApi(PORT);
        default:
            throw new Error("no server manger specified");
    }
}

function createDBManger()
{
    switch(process.env.DB_MANGER_TYPE)
    {
        case("mongodb"):
            return new mangoDBManger();
        default:
            throw new Error("no db manger specified");
    }
}

function initIOInputRoutes()
{
    APIManger.addRoute('get', '/api/v1/bootcamps/', bootcampsManger.getBootCamps);
    APIManger.addRoute('post', '/api/v1/bootcamps/', bootcampsManger.createBootcamp);

    APIManger.addRoute('get', '/api/v1/bootcamps/:id', bootcampsManger.getBootCamp);
    APIManger.addRoute('put', '/api/v1/bootcamps/:id', bootcampsManger.updateBootcamp);
    APIManger.addRoute('delete', '/api/v1/bootcamps/:id', bootcampsManger.deleteBootcamp);

    APIManger.addRoute('get', '/api/v1/bootcamps/radius/:zipcode/:distance', bootcampsManger.getBootcampWithinRadius);
    APIManger.addRoute('put', '/api/v1/bootcamps/:id/photo', bootcampsManger.uploadBootcampImage);

    APIManger.addRoute('get', '/api/v1/bootcamps/:bootcampId/courses', coursesManger.getAllCourses);
    
    
    APIManger.addRoute('get', '/api/v1/courses', coursesManger.getAllCourses);
    APIManger.addRoute('post', '/api/v1/courses', coursesManger.createCourse);

    APIManger.addRoute('get', '/api/v1/courses/:id', coursesManger.getAllCourses);
    APIManger.addRoute('put', '/api/v1/courses/:id', coursesManger.updateCourse);
    APIManger.addRoute('delete', '/api/v1/courses/:id', coursesManger.deleteCourse);
}
