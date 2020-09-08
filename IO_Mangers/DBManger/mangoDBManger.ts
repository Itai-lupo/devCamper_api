import mangodb from "mongodb";
import ErrorResponse from "../../utils/errorResponse";
import geocoder from "../../utils/Geocoder";
import asyncHandler from "../../utils/async";
import IDBManager from "./IDBManger";
import connectDB from "../../config/db";

import Bootcamp = require("./models/Bootcamps");
import Course = require("./models/Courses");

export default class mangoDBManger implements IDBManager
{
    private bootcampAmount: number = 0;
    private coursesAmount: number = 0;

    connect(): void 
    {
        connectDB();

        Bootcamp.countDocuments().then(count => this.bootcampAmount = count);
        Course.countDocuments().then(count => this.coursesAmount = count);
        
    }

    async getBootcamps(qury: any, params) 
    {
        let dbRequst = Bootcamp.find(qury);
        dbRequst = this.addOnTheFindPromeseTheQuery(params, dbRequst);

        const resualtBootcamps = await dbRequst;
        return resualtBootcamps;
    }
    

    private addOnTheFindPromeseTheQuery(params: any, dbRequst: any) {
        if(Object.keys(params).length === 0) return dbRequst;

        if (params.select == "" || params.select.includes("courses"))
            dbRequst = dbRequst.populate("courses");

        dbRequst = dbRequst.select(params.select);
        dbRequst = dbRequst.sort(params.sort);
        dbRequst = dbRequst.skip(params.skip);
        dbRequst = dbRequst.limit(params.limit);
        return dbRequst;
    }

    async getBootcamp(id: any) 
    {
        const bootcamp = await Bootcamp.findById(id);

        return bootcamp;
    }

    async createBootcamp(bootcampToCreate: any) 
    {
        this.bootcampAmount++;
        const newBootcamp = await Bootcamp.create(bootcampToCreate);

        return newBootcamp
    }

    async updateBootcamp(id: any, dataToUpdate: any) 
    {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
            runValidators: true
        });

        return updatedBootcamp;
    }

    async deleteBootcamp(id: any) 
    {
        this.bootcampAmount--;
        const deletedBootcamp = await Bootcamp.findByIdAndRemove(id);

        return deletedBootcamp;
    }

    async getBootcampWithinRadius(loction: any, radiusAroundTheLoction: any) 
    {
        const bootcampsWithinRange = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [loction, radiusAroundTheLoction] } }
        });

        return bootcampsWithinRange;
    }

    getBootcampAmount() 
    {
        Bootcamp.countDocuments({}, (err, count) => {
            if(err) throw new Error(err);
            this.bootcampAmount = count;
        })

        return this.bootcampAmount;
    }




    async getAllCourses(query: any) 
    {
        const resualtCourses = await Course.find(query).populate(
            {
                path: "bootcamp",
                select: "name description"
            });

        return resualtCourses;
    }

    async getSingleCourse(id: any)
    {
        const course = await Course.findById(id).populate(
            {
                path: "bootcamp",
                select: "name description"
            });

        return course;
    }

    async createCourse(CourseToCreate: any) 
    {
        this.coursesAmount++;
        const newCourse = await Course.create(CourseToCreate);

        return newCourse;
    }

    async updateCourse(id: any, dataToUpdate: any) 
    {
        const updatedCourse = await  Course.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
            runValidators: true
        });

        return updatedCourse;
    }

    async deleteCourse(id: any) 
    {
        this.coursesAmount--;
        const bootCampToDelete = await Course.findById(id);

        await (bootCampToDelete).remove();

        return bootCampToDelete;
    }

    getCourseAmount() 
    {
        Course.countDocuments({}, (err, count) => {
            if(err) throw new Error(err);
            this.coursesAmount = count;
        })
        return this.coursesAmount;
    }
}