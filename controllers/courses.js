const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Courses");
const asyncHandler = require("../middleware/async");

class CoursesControler
{
    // @route: GET /api/v1/courses/:bootcampId/courses
    // @route: GET /api/v1/courses/
    // @access   public
    static getAllCourses = asyncHandler( async (req, res, next) =>
    {
        let query = getBootCampIdIfThereIs(req);
        const courses = await Course.find(query).populate(
            {
            path: "bootcamp",
            select: "name description"
            });

        returnSuccessRespondToTheClient(res, 200, courses);
    })

    
}

function getBootCampIdIfThereIs(req)
{
    let query = {};
    if(req.params && req.params.bootcampId ) 
        query.bootcamp = req.params.bootcampId
    
    else if(req.query && req.query.bootcamp) 
        query.bootcamp = req.query.bootcamp

    return query;
    
}

function checkIfCourseFoundIfNotThrowErr(course, id)
{
    if(!course)
    {
        throw new ErrorResponse(`bootcamp wan't found with id of ${id}`, 404);
    }
}

function returnSuccessRespondToTheClient(res, status, data)
{
    res.status(status).json({
        success: true,
        count: data.length,
        data
    });
}

module.exports = CoursesControler;