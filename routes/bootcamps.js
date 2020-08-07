const express = require("express");
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
    require("../controllers/bootcamps");

const router = express.Router();

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance")
    .get(getBootcampWithInRadius)

module.exports = router;