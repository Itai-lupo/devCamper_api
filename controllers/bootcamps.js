

//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   public
exports.getBootcamps = (req, res, next) => 
{
    res.status(200).json({success: true, msg: 'show all bootcamps'});
}

//@desc     Get single bootcamp
//@route    Get /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = (req, res, next) => 
{
    res
        .status(200)
        .json({success: true, msg: `show bootcamp ${req.params.id}`});
}