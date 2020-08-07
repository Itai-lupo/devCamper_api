const dotenv = require("../utils/dotenvInit");
const 
{ 
    getBootcamp,
    getBootcamps,
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp
} = require("../controllers/bootcamps");

const connectDB = require("../config/db");


beforeAll(() => {
    connectDB();
});

describe("check the bootcamp controller", () => {
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
        return getBootcamps(null, res);
        
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
});

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

    return writeSucses;
}