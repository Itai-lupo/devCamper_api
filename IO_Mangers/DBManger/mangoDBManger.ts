import mangodb from "mongodb";
import ErrorResponse from "../../utils/errorResponse";
import geocoder from "../../utils/Geocoder";
import asyncHandler from "../../middleware/async";
import IDBManager from "./IDBManger";
const connectDB = require("../../config/db");

import Bootcamp from "./models/Bootcamps";
import Course from "./models/Courses";

export default class mangoDBManger implements IDBManager
{
    async getBootcamps(qury: any, params) {
        let dbRequst = Bootcamp.find(qury);

        if(!qury.sort) return dbRequst.sort("-createdAt");
        if (params.select == "" || params.select.includes("courses"))
        
        dbRequst = dbRequst.populate("courses");

        dbRequst = dbRequst.select(params.select);
        dbRequst = dbRequst.sort(params.sort);
        dbRequst = dbRequst.skip(params.skip);
        dbRequst = dbRequst.limit(params.limit);

        let resualtBootcamps = await dbRequst;

        return resualtBootcamps;
    }
    
    async getBootcamp(id: any) 
    {
        const bootcamp = await Bootcamp.findById(id);

        return bootcamp;
    }

    async createBootcamp(bootcampToCreate: any) 
    {
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
        const deletedBootcamp = await Bootcamp.findById(id);

        return deletedBootcamp;
    }

    async getBootcampWithInRadius(loction: any, radiusAroundTheLoction: any) 
    {
        const bootcampsWithinRange = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [loction, radiusAroundTheLoction] } }
        });

        return bootcampsWithinRange;
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

    async deleteCourse(id: any) {
        const bootCampToDelete = await Course.findById(id);

        await (bootCampToDelete).remove();

        return bootCampToDelete;
    }



    connect(url: string): void {
        connectDB();
    }

}