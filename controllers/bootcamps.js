const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamps");
const asyncHandler = require("../middleware/async");

//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => 
{
    const bootcamps = await Bootcamp.find();

    returnSuccessRespondToTheClient(res, 200, bootcamps);
});


//@desc     Get single bootcamp
//@route    Get /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = asyncHandler(async (req, res, next) => 
{
    const bootcamp = await findBootcampInTheDB(req.params.id);

    returnSuccessRespondToTheClient(res, 200, bootcamp);    
});

async function findBootcampInTheDB(id)
{
    const bootcamp = await Bootcamp.findById(id);

    checkIfBootcampFoundIfNotThrowErr(bootcamp, id);

    return bootcamp;
}

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps/
//@access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => 
{
    const bootcamp = await createBootcampInTheDB(req.body);

    returnSuccessRespondToTheClient(res, 201, bootcamp); 
});


async function createBootcampInTheDB(bootcampToCreate)
{
    const bootcamp = await Bootcamp.create(bootcampToCreate);

    return bootcamp;
}  

//@desc     update new bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => 
{
    const bootcamp = await updateBootcampInTheDB(req.params.id, req.body)

    returnSuccessRespondToTheClient(res, 200, bootcamp); 
});


async function updateBootcampInTheDB(id, update)
{
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true
    });

    checkIfBootcampFoundIfNotThrowErr(bootcamp, id);

    return bootcamp;
}  

//@desc     delete new bootcamp
//@route    delete /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => 
{
    await deleteBootcampInTheDB(req.params.id);

    returnSuccessRespondToTheClient(res, 200, {}); 
});

async function deleteBootcampInTheDB(id)
{
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    checkIfBootcampFoundIfNotThrowErr(bootcamp, id);
}  

function checkIfBootcampFoundIfNotThrowErr(bootcamp,id)
{
    if(!bootcamp)
    {
        throw new ErrorResponse(`bootcamp wan't found with id of ${id}`, 404);
    }
}

function returnSuccessRespondToTheClient(res, status, data)
{
    res.status(status).json({
        success: true,
        data: data
    });
}

