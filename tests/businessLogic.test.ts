require("../utils/dotenvInit");

import IDBManger from '../IO_Mangers/DBManger/IDBManger';
import mangoDBManger from '../IO_Mangers/DBManger/mangoDBManger';
import mongoose = require('mongoose');
import { MongoMemoryServer } from "mongodb-memory-server";

import bootcampLogic from '../business logic/bootcampUseCases';
import coursesLogic from '../business logic/coursesUseCases';

import Bootcamps = require('../IO_Mangers/DBManger/models/Bootcamps');
import Courses = require('../IO_Mangers/DBManger/models/Courses');

let bootcampsData = require('../_data/bootcamps.json');
let coursesData = require('../_data/courses.json');


let db:IDBManger;
let bootcampManger:bootcampLogic;
let courseManger:coursesLogic;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
	mongoServer = new MongoMemoryServer();
    db = new mangoDBManger();

    bootcampManger = new bootcampLogic(db);
    courseManger = new coursesLogic(db);
    
	const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    await Bootcamps.create(bootcampsData);
    return Courses.create(coursesData);

});


afterAll(() => {
    return mongoose.disconnect();
})

describe("test the bootcamp Busines logic modle", () => {
    
    test("check that the bootcamps manger can read the bootcamps", async () => {
        const bootcamps = await db.getBootcamps({}, {select: "-courses"})

        const res = {
            status: function(status){
                expect(status).toBe(200);
                return this;
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                obj.data.forEach(e => {
                    if(e.name.includes("test")) return undefined;
                });
                expect(obj.data.sort()).toEqual(bootcamps.sort());
            }
        }

        return bootcampManger.getBootCamps({query: {select: "-courses"}}, res, null);
        
    });

    test("check the bootcamps manger CRUD to the db", async () => {
        const res = {
            status: function(status){
            if(status == 200 || status == 201) return this;
            else throw new Error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
            }
        }

        const id = "5d725a1b7b292f5f8ceff781";
        
        return expect(bootcampCRUDcheck({
                
            _id: id,
            name: "test bootcamp",
            description: "abcdefg",
            address: "test 1234"
            
        }, id)).toBeTruthy();
    });

    test("find all bootcamps on earth using within radios", async () => {
        db.getBootcampAmount();

        const res = {

            status: function(status){
                if(status == 200) return this;
                    else throw new Error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.length).toBe(db.getBootcampAmount());
            }
        }

        const req = { 
            params:
            {
                zipcode: "02215-1405",
                distance: Math.pow(6371, 2)
            }
 
        };

        return await bootcampManger.getBootcampWithinRadius(req, res, null);
    });

    

    async function bootcampCRUDcheck(bootampToCreate, id)
    {
        let createSuccess = await createTheTestBootCampAndReturnTrueIfsuccess(bootampToCreate, id);
        let deletesuccess = await DeleteTheTestBootCampAndReturnTrueIfsuccess(id);
        return createSuccess && deletesuccess;
    }

    async function createTheTestBootCampAndReturnTrueIfsuccess(bootampToCreate, id)
    {
        let createSuccess = true;
        await bootcampManger.createBootcamp(bootampToCreate);
        await bootcampManger.getBootCamp(id).catch(e => createSuccess = false);
        return createSuccess;
    }

    async function DeleteTheTestBootCampAndReturnTrueIfsuccess(id)
    {
        let deletesuccess = false;
        await bootcampManger.deleteBootcamp(id);
        await bootcampManger.getBootCamp(id).catch(e => deletesuccess = true);

        return deletesuccess;
    }
});


describe("test the course Busines logic modle", () => {

    test("get all courses", () => {
        db.getCourseAmount();
        const res = {
            status: function(statusCode){
                if(statusCode == 200) return res;
                else throw new Error(`something went wrong code: ${statusCode}`);
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.length).toBe(db.getCourseAmount());
            }

        }

        return courseManger.getAllCourses({}, res, null);
    });

    test("check that the courses controler can Delete create and get single course in db", (done) => {
        const id = "5d725a1b7b292f5f8ceff782";
        const req = { 
            body: 
            {
                
                _id: id,
                title: "IOS Development",
                description: "Get started building mobile applications for IOS using Swift and other tools",
                weeks: 8,
                tuition: 6000,
                minimumSkill: "intermediate",
                scholarhipsAvailable: false,
                bootcamp: "5d725a037b292f5f8ceff787"
                
            },
            params:
            {
                id
            }

        };

        const res = {
            status: function(status){
                if(status == 200 || status == 201) return this;
                else throw new Error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();

                Object.keys(req.body).forEach(key => {
                    if(key !== "bootcamp")
                        expect(obj.data[key].toString()).toEqual(req.body[key].toString());
                })
                
            }
        }


        
        courseCRUDcheck(req, res, id).then( work => {
            expect(work).toBeTruthy();
            done();
        })
        
    });

    async function courseCRUDcheck(req, res, id)
    {

        await cleanTheDbFromTheTestCourseIfNeded(req, id);


        let createSuccess = await createTheTestCourseAndReturnTrueIfsuccess(req, res, id);
        let deletesuccess = await DeleteTheTestCourseAndReturnTrueIfsuccess(req, res, id);
        return createSuccess && deletesuccess;
    }

    async function cleanTheDbFromTheTestCourseIfNeded(req, id)
    {

        let deleteFirst = true; 
        let res = {
            status: function(status){ 
                if(status == 404) deleteFirst = false;
                return this; 
            },
            json: (obj) => {
               if(!obj.data) deleteFirst = false;
            }
        }
        await courseManger.getSingleCourse(req, res).catch(e => {
            if(e.message = `course wan't found with id of ${id}`) deleteFirst = false;
        });
        if(deleteFirst) await courseManger.deleteCourse(req, res);
    }

    async function createTheTestCourseAndReturnTrueIfsuccess(req, res, id)
    {
        let createSuccess = true;
        await courseManger.createCourse(req, res);
        await courseManger.getSingleCourse(req, res).catch(e => createSuccess = false);
        return createSuccess;
    }

    async function DeleteTheTestCourseAndReturnTrueIfsuccess(req, res, id)
    {
        let deletesuccess = false;
        await courseManger.deleteCourse(req, res);
        await courseManger.getSingleCourse(req, res).catch(e => deletesuccess = true);

        return deletesuccess;
    }

});