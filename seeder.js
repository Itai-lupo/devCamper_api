

const dotenv = require("dotenv");

dotenv.config({path: './config/config.env'});

const mongoose = require("mongoose");
const Bootcamp = require('./models/Bootcamps');
const Course = require('./models/Courses');

const fs = require("fs");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));


async function importData()
{
    try 
    {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log("data imported");
        process.exit();  
    } 
    catch (e) 
    {
        console.log(e);
    }
}

async function deleteData()
{
    try 
    {
        await Course.deleteMany();
        await Bootcamp.deleteMany();
        console.log("data deleted");
        process.exit();  
    } 
    catch (e) 
    {
        console.log(e);
    }
}

if(process.argv[2] === "-i")
{
    importData()
}
else if(process.argv[2] === "-D")
{
    deleteData();
}