const express = require("express");
const CoursesControler = require('../../DBManger/controllers/courses')
const 
    { 
        getBootcamp,
        getBootcamps,
        createBootcamp, 
        updateBootcamp, 
        deleteBootcamp,
        getBootcampWithInRadius
    } 
    =
    require("../../../ArchiveFiles/bootcamps.txt");

const router = express.Router();

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance")
    .get(getBootcampWithInRadius);

router.route("/:bootcampId/courses")
    .get(CoursesControler.getAllCourses);

module.exports = router;