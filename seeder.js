

const dotenv = require("dotenv");

dotenv.config({path: './config/config.env'});

const mongoose = require("mongoose");
const Bootcamp = require('./models/Bootcamps');

const fs = require("fs");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));

async function importData()
{
    try 
    {
        await Bootcamp.create(bootcamps);
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