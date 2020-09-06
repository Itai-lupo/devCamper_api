require('../utils/dotenvInit');

import IDBManger from '../IO_Mangers/DBManger/IDBManger';
import mangoDBManger from '../IO_Mangers/DBManger/mangoDBManger';
import mongoose = require('mongoose');

import Bootcamps = require('../IO_Mangers/DBManger/models/Bootcamps');
import Courses = require('../IO_Mangers/DBManger/models/Courses');

let db:IDBManger;

beforeAll(async () => {
    db = new mangoDBManger();

    return await mongoose.connect(process.env.MONGO_TEST_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
});

describe("basic CRUD test for the bootcamps", () => {
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
        const bootcamps = db.getBootcampWithinRadius([0, 0], 6371);

        expect(bootcamps.length).toBe(db.getBootcampAmount());


        return await db.getBootcamps({}, {});
    })

})
 








