import asyncHandler  = require("../utils/async");
import geocoder = require("../utils/Geocoder");
import ErrorResponse = require("../utils/errorResponse");
import path = require('path');
import queryFormater from '../utils/queryFormater';

export default class bootcampLogic
{
    private db;

    constructor(db)
    {
        this.db = db;
    }

    getBootCamps = asyncHandler( async (req, res, next) => {
        let query = req.query || {};

        const bootcampTotalAmount = this.db.getBootcampAmount()
        const {pagination, params, formatQuery} = queryFormater(query, bootcampTotalAmount);
        
        const resBootCamps = await this.db.getBootcamps(formatQuery, params);

        this.returnSuccessRespondToTheClientWithPage(res, 200, resBootCamps, pagination);
    })

    

    getBootCamp = asyncHandler( async (req, res, next) => {
        const id = req.params.id;       

        const resBootCamps = await this.db.getBootcamp(id);

        this.returnSuccessRespondToTheClient(res, 200, resBootCamps);
    })


    createBootcamp = asyncHandler( async (req, res, next) => {
        const bootcampToCreate = req.body;       

        const resBootCamps = await this.db.createBootcamp(bootcampToCreate);

        this.returnSuccessRespondToTheClient(res, 200, resBootCamps);
    })

    updateBootcamp = asyncHandler( async (req, res, next) => {
        const id = req.params.id; 
        const changesToTheBootcamp = req.body;       

        const resBootCamps = await this.db.updateBootcamp(id, changesToTheBootcamp);

        this.returnSuccessRespondToTheClient(res, 200, resBootCamps);
    })

    deleteBootcamp = asyncHandler( async (req, res, next) => {
        const id = req.params.id;  

        const resBootCamps = await this.db.deleteBootcamp(id);

        this.returnSuccessRespondToTheClient(res, 200, {});
    })

    getBootcampWithinRadius = asyncHandler( async (req, res, next) => {
        const {zipcode, distance} = req.params;

        const loction = await this.getLatitudeAndLongitude(zipcode);

        const radiusAroundTheLoction = this.findRadiousAroundTheLoctionInKm(distance);

        const bootcamps = await this.db.getBootcampWithinRadius(loction, radiusAroundTheLoction);
        
        return this.returnSuccessRespondToTheClient(res, 200, bootcamps); 
    })

    private async getLatitudeAndLongitude(zipcode)
    {
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude; 
        
        return [lng, lat]
    }
    
    private findRadiousAroundTheLoctionInKm(distance)
    {
        const EarthRadius = 6371;
        const radiusAroundTheLoction = distance/EarthRadius;
        return radiusAroundTheLoction;
    }

    uploadBootcampImage = asyncHandler(async (req, res, next) => {
        const id = req.params.id;
        const file = req.files.file;

        const bootcamp = await this.db.getBootcamp(id);

        if(!bootcamp)
            return next(new ErrorResponse(`bootcamp not found with id of ${id}`, 400));

        if(!file)
            return next(new ErrorResponse("please upload file", 400));

        if(!file.mimetype.startsWith("image/"))
            return next(new ErrorResponse("please upload an image file", 400));
        
        if(file.size > parseInt(process.env.MAX_FILE_UPLOAD))
            return next(
                new ErrorResponse(
                `please upload an image with size less then ${process.env.MAX_FILE_UPLOAD}`,
                400));
            
        file.name = `photo_${id}${path.parse(file.name).ext}`;
        
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, 
            async err => {
                if(err) 
                    return next(new ErrorResponse(`failed to upload image file`, 500));
                
                await this.db.updateBootcamp(id, { photo: file.name});

                this.returnSuccessRespondToTheClient(res, 200, file.name);
            })
    })


    private returnSuccessRespondToTheClient(res, status, data)
    {
        return res.status(status).json({
            success: true,
            data
        });
    }

    private returnSuccessRespondToTheClientWithPage(res, status, data, pagination)
    {
        return res.status(status).json({
            success: true,
            data,
            pagination
        });
    }
}