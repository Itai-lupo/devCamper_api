import asyncHandler  = require("../utils/async");
import ErrorResponse = require("../utils/errorResponse");

export default class coursesLogic
{
    private db;

    constructor(db)
    {
        this.db = db;
    }

    getAllCourses = asyncHandler( async (req, res, next) => {
        let query = req.query || {};

        let pagination = this.FormatPagination(req.query)

        this.moveTheSearchParamsFromTheQueryToNewObject(query);

        if(req.params)
            query.bootcamp = query.bootcamp || req.params.bootcampId;
        query = this.addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query);

        const resCourses = await this.db.getAllCourses(query);

        this.returnSuccessRespondToTheClientWithPage(res, 200, resCourses, pagination);
    })

    private FormatPagination(query)
    {
        if(!query) return {};

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 100;

        const endIndex = (page * limit);
        const startIndex = (page - 1) * limit;
        const total =  this.db.getCourseAmount()
        const pagination:any = {};

        if(endIndex < total) 
            pagination.next = {page: page + 1, limit}
        
        if(startIndex > 0) 
            pagination.last = {page: page - 1, limit}

        return pagination;

    }

    private moveTheSearchParamsFromTheQueryToNewObject(query) {
        let params:any = {};
        const fieldsToExclude = ["select", "sort", "limit", "page"];
        fieldsToExclude.forEach(field => {
            params[field] = query[field] || "";
            delete query[field];
        });

        if(params.sort === "") params.sort = "-createdAt";

        return params;
    }

    private addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query: any) {
        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = JSON.parse(queryStr);
        return query;
    }

    getSingleCourse = asyncHandler( async (req, res, next) => {
        const id = req.params.id;

        const resCourse = await this.db.getSingleCourse(id);
        this.checkIfCourseFoundIfNotThrowErr(resCourse, id);

        this.returnSuccessRespondToTheClient(res, 200, resCourse);
    })

    createCourse = asyncHandler( async (req, res, next) => {
        const CourseToCreate = req.body;

        const resCourse = await this.db.createCourse(CourseToCreate);

        this.returnSuccessRespondToTheClient(res, 200, resCourse);
    })

    updateCourse = asyncHandler( async (req, res, next) => {
        const id = req.params.id;
        const ChangesToTheCourse = req.body;

        const resCourse = await this.db.createCourse(id, ChangesToTheCourse);

        this.checkIfCourseFoundIfNotThrowErr(resCourse, id);

        this.returnSuccessRespondToTheClient(res, 200, resCourse);
    })

    deleteCourse = asyncHandler( async (req, res, next) => {
        const id = req.params.id;

        const resCourse = await this.db.deleteCourse(id);

        this.returnSuccessRespondToTheClient(res, 200, resCourse);
    })


    checkIfCourseFoundIfNotThrowErr(course, id)
    {
        if(!course)
        {
            throw new ErrorResponse(`course wan't found with id of ${id}`, 404);
        }
    }


    private returnSuccessRespondToTheClient(res, status, data)
    {
        res.status(status).json({
            success: true,
            data
        });
    }

    private returnSuccessRespondToTheClientWithPage(res, status, data, pagination)
    {
        res.status(status).json({
            success: true,
            data,
            pagination
        });
    }
}