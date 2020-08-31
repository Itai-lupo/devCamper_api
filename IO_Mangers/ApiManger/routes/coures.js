const express = require("express");
const CoursesControler  = require("../controllers/courses");


const router = express.Router();

router.route("/")
    .get(CoursesControler.getAllCourses)
    .post(CoursesControler.createCourse)

router.route("/:id")
    .get(CoursesControler.getSingleCourse)
    .put(CoursesControler.updateCourse)
    .delete(CoursesControler.deleteCourse)

module.exports = router;