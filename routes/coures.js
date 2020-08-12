const express = require("express");
const CoursesControler  = require("../controllers/courses");


const router = express.Router();

router.route("/")
    .get(CoursesControler.getAllCourses)



module.exports = router;