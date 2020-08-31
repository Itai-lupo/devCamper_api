const ErrorResponse = require("../../../utils/errorResponse");
const Bootcamp = require("../models/Bootcamps");
const geocoder = require("../../../utils/Geocoder");
const asyncHandler = require("../../../middleware/async");

//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   public
exports.getBootcamps = asyncHandler(async (req, res, next) => 
{
    const bootcamps = await createQuerySearchInTheDB(req);

    const pagination = await FormatPagination(req.query);

    returnSuccessRespondToTheClientWithPage(res, 200, bootcamps, pagination);
});

async function createQuerySearchInTheDB(req) {
    let query = findBootCampsInTheDB({ ...req.query });
    
    if(!req.query) return query.sort("-createdAt");

    const select = FormatSelectOrSortFields(req.query.select);
    const sort = FormatSelectOrSortFields(req.query.sort);
    const {limit, skip} = findTheLimitAndPage(req.query);

    query = createTheQuryPromess(query, {select,  sort, skip, limit});
    return query;
}

function createTheQuryPromess(query, params ) {
    
    if (params.select == "" || params.select.includes("courses"))
        query = query.populate("courses");

    query = query.select(params.select);
    query = query.sort(params.sort);
    query = query.skip(params.skip);
    query = query.limit(params.limit);
    return query;
}

async function FormatPagination(query)
{
    if(!query) return {};
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100;
    const endIndex = (page * limit);
    const startIndex = (page - 1) * limit;
    const total = await Bootcamp.count();

    const pagination = {};

    if(endIndex < total) 
        pagination.next = {page: page + 1, limit}
    
    if(startIndex > 0) 
        pagination.last = {page: page - 1, limit}

    return pagination;

}

function findTheLimitAndPage(query)
{
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100;
    const skip = (page - 1) * limit;
    
    return {limit, skip};
}

function FormatSelectOrSortFields(field)
{
    if(!field) return "";
    return field.split(",").join(" ");
}

function findBootCampsInTheDB(query) {
    query = formatQuryParmaters(query);
    return Bootcamp.find(query);
}

function formatQuryParmaters(query)
{
    if(!query)  return {};

    query = removeFieldToExcludeFromTheQury(query);
    query = addDollarSignAtTheBeginingOfAquryComparisonOperatorsIfThereIs(query);
    return query;
}

function addDollarSignAtTheBeginingOfAquryComparisonOperatorsIfThereIs(query)
{
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = JSON.parse(queryStr);

    return query;
}

function removeFieldToExcludeFromTheQury(query)
{
    const fieldsToExclude = ["select", "sort", "limit", "page"];
    fieldsToExclude.forEach(field => delete query[field]);
    return query;
}

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
    const bootcamp = await Bootcamp.findById(id);

    checkIfBootcampFoundIfNotThrowErr(bootcamp, id);

    bootcamp.remove();
}  

//@desc     GET new bootcamp
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   public
exports.getBootcampWithInRadius = asyncHandler(async (req, res, next) => 
{
    const {zipcode, distance} = req.params;

    const loction = await getLatitudeAndLongitude(zipcode)
    const radiusAroundTheLoction = findRadiousAroundTheLoctionInKm(distance);

    const bootcamps = await findBootcampWithinRangeInTheDB(loction, radiusAroundTheLoction)

    returnSuccessRespondToTheClient(res, 200, bootcamps); 
});


async function findBootcampWithinRangeInTheDB(loction, radiusAroundTheLoction) {
    const bootcampsWithinRange = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [loction, radiusAroundTheLoction] } }
    });
    return bootcampsWithinRange;
}

async function getLatitudeAndLongitude(zipcode)
{
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude; 

    return [lng, lat]
}

function findRadiousAroundTheLoctionInKm(distance)
{
    const EarthRadius = 6371;
    const radiusAroundTheLoction = distance/EarthRadius
    return radiusAroundTheLoction;
}








function checkIfBootcampFoundIfNotThrowErr(bootcamp, id)
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
        data
    });
}

function returnSuccessRespondToTheClientWithPage(res, status, data, pagination)
{
    res.status(status).json({
        success: true,
        data,
        pagination
    });
}


