const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Courses");
const asyncHandler = require("../middleware/async");

class CoursesControler
{
    // @route: GET /api/v1/courses/:bootcampId/courses
    // @route: GET /api/v1/courses/
    // @access:   public
    static getAllCourses = asyncHandler( async (req, res, next) =>
    {
        let query = getBootCampIdFrom_req(req);
        const courses = await Course.find(query).populate(
            {
            path: "bootcamp",
            select: "name description"
            });

        returnSuccessRespondToTheClient(res, 200, courses);
    })

    
    // @route: GET /api/v1/courses/:id
    // @access: public
    static getSingleCourse = asyncHandler( async (req, res, next) =>
    {
        
        const courses = await Course.findById(req.params.id).populate(
            {
            path: "bootcamp",
            select: "name description"
            });

        checkIfCourseFoundIfNotThrowErr(courses, req.params.id)

        returnSuccessRespondToTheClient(res, 200, courses);
    })


    // @route: Post /api/v1/courses/
    // @access: private
    static createCourse = asyncHandler( async (req, res, next) =>
    {
        
        const courses = await Course.create(req.body)

        checkIfCourseFoundIfNotThrowErr(courses, req.params.id)

        returnSuccessRespondToTheClient(res, 201, courses);
    })


    // @route: Put /api/v1/courses/:id
    // @access: private
    static updateCourse = asyncHandler( async(req, res, next) => 
    {
        const course = await  Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }) 
        
        checkIfCourseFoundIfNotThrowErr(courses, req.params.id)

        returnSuccessRespondToTheClient(res, 200, courses);
    })


    // @route: Delete /api/v1/courses/:id
    // @access: private
    static deleteCourse = asyncHandler( async(req, res, next) => 
    {
        await Course.findByIdAndRemove(req.params.id) 

        returnSuccessRespondToTheClient(res, 200, []);
    })
    
}

function getBootCampIdFrom_req(req)
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
        throw new ErrorResponse(`course wan't found with id of ${id}`, 404);
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