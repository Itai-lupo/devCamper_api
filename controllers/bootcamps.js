const Bootcamp = require("../models/Bootcamps");

//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   public
exports.getBootcamps = async (req, res, next) => 
{
    try{
        const bootcamps = await Bootcamp.find();

        res.json({
            success: true,
            data: bootcamps
        })
    }
    catch (e){
        res.status(400).json({success: false, msg: e.message});

    }

}


//@desc     Get single bootcamp
//@route    Get /api/v1/bootcamps/:id
//@access   public
exports.getBootcamp = async (req, res, next) => 
{
    try{
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp)
        {
            return res.status(404).json({success: false});
        }


        res.json({
            success: true,
            data: bootcamp
        })
    }
    catch (e){ 
        res.status(400).json({success: false, msg: e.message});

    }
}


//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps/
//@access   Private
exports.createBootcamp = async (req, res, next) => 
{
    try
    {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    }
    catch (e)
    {
        res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

//@desc     update new bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = async (req, res, next) => 
{
    try
    {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!bootcamp)
        {
            return res.status(404).json({success: false});
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        });
    }
    catch (e)
    {
        res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

//@desc     delete new bootcamp
//@route    delete /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = async (req, res, next) => 
{
    try
    {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp)
        {
            return res.status(404).json({success: false});
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (e)
    {
        res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

