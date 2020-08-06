const Bootcamp = require("../models/Bootcamps");

//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   public
exports.getBootcamps = async (req, res, next) => 
{
    try{
        const bootcamps = await Bootcamp.find();

        returnSuccessRespondToTheClient(res, 200, bootcamps);
    }
    catch (e){
        next(e);
    }

}


//@desc     Get single bootcamp
//@route    Get /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = async (req, res, next) => 
{
    try{
        const bootcamp = await findBootcampInTheDB(req.params.id);

        returnSuccessRespondToTheClient(res, 200, bootcamp);
    }
    catch (e){ 
        next(e);
    }
}

async function findBootcampInTheDB(id)
{
    const bootcamp = await Bootcamp.findById(id);

    checkIfBootcampFoundIfNotThrowErr(bootcamp);

    return bootcamp;
}  

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps/
//@access   Private
exports.createBootcamp = async (req, res, next) => 
{
    try
    {
        const bootcamp = await createBootcampInTheDB(req.body);

        returnSuccessRespondToTheClient(res, 201, bootcamp);
    }
    catch (e)
    {
        next(e);
    }
}


async function createBootcampInTheDB(bootcampToCreate)
{
    const bootcamp = await Bootcamp.create(bootcampToCreate);

    return bootcamp;
}  

//@desc     update new bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = async (req, res, next) => 
{
    try
    {
        const bootcamp = await updateBootcampInTheDB(req.params.id, req.body)

        returnSuccessRespondToTheClient(res, 200, bootcamp);
    }
    catch (e)
    {
        next(e);
    }
}


async function updateBootcampInTheDB(id, update)
{
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true
    });

    checkIfBootcampFoundIfNotThrowErr(bootcamp);

    return bootcamp;
}  

//@desc     delete new bootcamp
//@route    delete /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next) => 
{
    try
    {
        await deleteBootcampInTheDB(req.params.id);

        returnSuccessRespondToTheClient(res, 200, {});
    }
    catch (e)
    {
        next(e);
    }
}

async function deleteBootcampInTheDB(id)
{
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    checkIfBootcampFoundIfNotThrowErr(bootcamp);
}  



function checkIfBootcampFoundIfNotThrowErr(bootcamp)
{
    if(!bootcamp)
    {
        throw new Error("bootcamp wan't found");
    }
}

function returnSuccessRespondToTheClient(res, status, data)
{
    res.status(status).json({
        success: true,
        data: data
    });
}

