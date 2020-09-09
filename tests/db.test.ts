require('../utils/dotenvInit');

import IDBManger from '../IO_Mangers/DBManger/IDBManger';
import mangoDBManger from '../IO_Mangers/DBManger/mangoDBManger';
import mongoose = require('mongoose');
import { MongoMemoryServer } from "mongodb-memory-server";

import Bootcamps = require('../IO_Mangers/DBManger/models/Bootcamps');
import Courses = require('../IO_Mangers/DBManger/models/Courses');

let bootcampsData = require('../_data/bootcamps.json');
let coursesData = require('../_data/courses.json');

let db:IDBManger;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
	mongoServer = new MongoMemoryServer();
    db = new mangoDBManger();

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

describe("basic CRUD test for the bootcamps", () => {
    beforeAll(() => {
        db.getBootcampAmount()
    })
    test("get all bootcamps", async () => {

        const bootcamps = await db.getBootcamps({}, {});
        expect(bootcamps).toStrictEqual(await Bootcamps.find());

        return await db.getBootcamps({}, {});
    })

    test("read write delete test", async () => {
        const ToCreate = {
            name: "test 1",
            careers: [
                "Web Development",
                "Data Science",
                "Business"
            ],
            description: "Is coding your passion? Codemasters",
            phone: "(333) 333-3333",
            email: "enroll@codemasters.com",
            address: "85 South Prospect Street Burlington VT 05405",
        }

        const bootCamp = await db.createBootcamp(ToCreate);
        
        Object.keys(ToCreate).forEach(key => {
            if(key !== "address")
                expect({v: [...ToCreate[key]]}).toEqual({v: [...bootCamp[key]]});
        })

        const deleted = await db.deleteBootcamp(bootCamp._id);

        expect(deleted.toObject()).toEqual(bootCamp.toObject());
        
        expect(await db.getBootcamp(deleted._id)).toBeNull();

        return await db.getBootcamps({}, {});
    })



    test("CRUD test", async () => {
        const ToCreate = {
            name: "test 2",
            careers: [
                "Web Development",
                "Data Science",
                "Business"
            ],
            description: "Is coding your passion? Codemasters",
            phone: "(333) 333-3333",
            email: "enroll@codemasters.com",
            address: "85 South Prospect Street Burlington VT 05405",
        }

        const bootCamp = await db.createBootcamp(ToCreate);
        
        Object.keys(ToCreate).forEach(key => {
            if(key !== "address")
                expect({v: [...ToCreate[key]]}).toEqual({v: [...bootCamp[key]]});
        })
        
        const updated = await db.updateBootcamp(bootCamp._id, {
            address: "86 South Prospect Street Burlington VT 05405"
        })

        expect(bootCamp.toObject()).not.toEqual(updated.toObject());

        const deleted = await db.deleteBootcamp(bootCamp._id);

        expect(deleted.toObject()).toEqual(updated.toObject());
        
        expect(await db.getBootcamp(deleted._id)).toBeNull();

        return await db.getBootcamps({}, {});
    })

    test("get with in earth radius get all boot camps", async () => {
        db.getBootcampAmount()
        const bootcamps = await db.getBootcampWithinRadius([0, 0], 6371);
        const len = bootcamps.length;
        expect(len).toBe(db.getBootcampAmount());


        return db.getBootcamps({}, {});
    })

    test("get all bootcamps with housing true", async () => {

        const bootcamps = await db.getBootcamps({housing: true}, {});

        bootcamps.forEach(v => {
            expect(v.housing).toBe(true);
        });

        return await db.getBootcamps({}, {});
    })

    test("get all bootcamps with select of housing and name", async () => {

        const bootcamps = await db.getBootcamps({}, {select: "housing name"});

        bootcamps.forEach(v => {
            
            expect(Object.keys(v.toObject()).sort()).toEqual(["housing", "_id", "name", "id"].sort());
        });

        return await db.getBootcamps({}, {});
    })

    test("get all bootcamps with sort avgCost", async () => {

        const bootcamps = await db.getBootcamps({}, {sort: "-averageCost", select: "averageCost"});

        let last = bootcamps[0]["averageCost"];
        bootcamps.forEach(v => {
            expect(v["averageCost"]).toBeLessThanOrEqual(last);
            last = v["averageCost"];
        }); 

        return await db.getBootcamps({}, {});
    })
})
 

describe("basic CRUD test for the courses", () =>{

    test("read all courses", async () => {
        const courses = await db.getAllCourses(undefined);
        const compereCourese:any = await Courses.find();
        
        for(let i = 0; i < courses.length; i++)
        {
            compereCourese[i].bootcamp = undefined;
            compereCourese[i] = compereCourese[i].toObject();

            courses[i].bootcamp = undefined;
            courses[i] = courses[i].toObject();
        }
        
        
        
        expect(courses).toEqual(compereCourese);

        return await db.getAllCourses({});
    })

    test("read write delete test", async () => {
        const ToCreate = {
            title: "test 1",
            description: "This course will provide you with all of the essentials to become a successful frontend web developer",
            weeks: 8,
            tuition: 8000,
            minimumSkill: "beginner",
            scholarhipsAvailable: true,
            bootcamp: "5d713995b721c3bb38c1f5d0"
        }

        const Course = await db.createCourse(ToCreate);
        
        Object.keys(ToCreate).forEach(key => {
            if(key !== "bootcamp")
                expect(ToCreate[key]).toEqual(Course[key]);
        })

        const deleted = await db.deleteCourse(Course._id);

        expect(deleted.toObject()).toEqual(Course.toObject());
        
        expect(await db.getSingleCourse(deleted._id)).toBeNull();

        return await db.getAllCourses({});
    })

    test("CRUD test", async () => {
        const ToCreate = {
            title: "test 1",
            description: "This course will provide you with all of the essentials to become a successful frontend web developer",
            weeks: 8,
            tuition: 8000,
            minimumSkill: "beginner",
            scholarhipsAvailable: true,
            bootcamp: "5d713995b721c3bb38c1f5d0"
        }

        const Course = await db.createCourse(ToCreate);
        
        Object.keys(ToCreate).forEach(key => {
            if(key !== "bootcamp")
                expect(ToCreate[key]).toEqual(Course[key]);
        }) 

        const updated = await db.updateCourse(Course._id, {title: "test 1 U"})

        expect(Course.toObject()).not.toEqual(updated.toObject());

        const deleted = await db.deleteCourse(Course._id);

        expect(deleted.toObject()).toEqual(updated.toObject());
        
        expect(await db.getSingleCourse(deleted._id)).toBeNull();

        return await db.getAllCourses({});
    })
})







