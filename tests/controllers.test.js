const dotenv = require("../utils/dotenvInit");
const 
{ 
    getBootcamp,
    getBootcamps,
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampWithInRadius
} = require("../controllers/bootcamps");

const connectDB = require("../config/db");
const Bootcamps = require("../models/Bootcamps");

var bootcampCount;

beforeAll(() => {
    connectDB();
});

describe("check the bootcamp controller", () => {
    beforeAll(() => {
        return Bootcamps.count().then(count => bootcampCount = count);
    })
    
    test("check that the bootcamps contoler method exist", () => {
        expect(getBootcamps).toBeTruthy();
        expect(getBootcamp).toBeTruthy();
        expect(createBootcamp).toBeTruthy();
        expect(updateBootcamp).toBeTruthy();
        expect(deleteBootcamp).toBeTruthy();
    });

    test("check that the bootcamps controler gets all the bootcamps from the db", () => {
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
            }
        }
        return getBootcamps({}, res);
        
    });

    test("check that the bootcamps controler trohw err on traing to create empty bootcamp in db", 
        () => {
        const res = {
            status: function(status){
            if(status == 201) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
            }
        }

        const req = {
            body: {}
        }
        
        return createBootcamp(req, res).catch((e)=> 
                    expect(e.message)
                        .toBe("Bootcamp validation failed: address: Please add an address, description: please add description, name: please add name"));

    });

    test("check that the bootcamps controler can Delete create and get single bootcamp in db", 
        () => {
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

        const req = { 
            body: 
            {
                
                _id: id,
                name: "test bootcamp",
                description: "abcdefg",
                address: "test 1234"
                
            },
            params:
            {
                id
            }

        };
        
        return expect(bootcampCRUDcheck(req, res, id)).toBeTruthy();
    });

    test("find all bootcamps on earth using within radios", () => {
        const res = {

            status: function(status){
            if(status == 200) return this;
                else throw new Error("there is error");
            },

            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.length).toBe(bootcampCount);
            }
        }

        const req = { 
            params:
            {
                zipcode: "02215-1405",
                distance: 6371
            }

        };

        return getBootcampWithInRadius(req, res);
    });

    test("find all bootcamps with avrageCost less then or equal 10000", () =>{
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.every(v => v.averageCost <= 10000)).toBe(true);
            }
        }

        const req = {query: {averageCost: {lte: 10000}}}

        return getBootcamps(req, res);
    });

    test("find all bootcamps with avrageCost more then 10000 and housing", () =>{
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.every(v => v.averageCost > 10000 && v.housing)).toBe(true);
            }
        }

        const req = {query: {averageCost: {gt: 10000}, housing: true}};

        return getBootcamps(req, res);
    });

    test("find all bootcamps and show only the names", () =>{
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data.every(v => 
                   {
                        return Object.keys(v.toObject()).length == 2 
                    }))
                    .toBe(true);
            }
        }  

        const req = {query: {select: "name"}};

        return getBootcamps(req, res);
    });

    test("sort all boot camps by averageCost", () =>{
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data
                    .every((v,i,a) => !i || a[i-1].averageCost <= v.averageCost))
                    .toBe(true);
            }
        }  

        const req = {query: {sort: "averageCost"}};

        return getBootcamps(req, res);
    });

    test("limit and page seperate the bootcamps", () =>{
        let LastId = "";
        let nextPage = {};
        const res = {
            status: function(status){
            if(status == 200) return this;
            else throw new error("there is error");
            },
            json: (obj) => {
                expect(obj.success).toBeTruthy();
                expect(obj.data).toBeTruthy();
                expect(obj.data[0].id).not.toBe(LastId);

                LastId = obj.data[0].id;
            }
        }  

        const req = {query: {limit: "1", page: "1", select: "id"}};

        return GetAllTheBootCampsPages(req, res, nextPage);
            
            
    });

});

async function GetAllTheBootCampsPages(req, res)
{
    while(req.query.page <= bootcampCount)
    {
        await getBootcamps(req, res);
        req.query.page++;
    }

}


async function bootcampCRUDcheck(req, res, id)
{

    await cleanTheDbFromTheTestBootCampIfNeded(req, res, id);


    let createSuccess = await createTheTestBootCampAndReturnTrueIfsuccess(req, res, id);
    let deletesuccess = await DeleteTheTestBootCampAndReturnTrueIfsuccess(req, res, id);
    return createSuccess && deletesuccess;
}

async function cleanTheDbFromTheTestBootCampIfNeded(req, res, id)
{

    let deleteFirst = true; 
    await getBootcamp(req, res).catch(e => {
        if(e.message = `bootcamp wan't found with id of ${id}`) deleteFirst = false;
    });
    if(deleteFirst) await deleteBootcamp(req, res);
}

async function createTheTestBootCampAndReturnTrueIfsuccess(req, res, id)
{
    let createSuccess = true;
    await createBootcamp(req, res);
    await getBootcamp(req, res).catch(e => createSuccess = false);
    return createSuccess;
}

async function DeleteTheTestBootCampAndReturnTrueIfsuccess(req, res, id)
{
    deletesuccess = false;
    await deleteBootcamp(req, res);
    await getBootcamp(req, res).catch(e => deletesuccess = true);

    return deletesuccess;
}