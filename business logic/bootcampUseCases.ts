import asyncHandler  = require("../utils/async");
import geocoder = require("../utils/Geocoder");

export default class bootcampLogic
{
    private db;

    constructor(db)
    {
        this.db = db;
    }

    getBootCamps = asyncHandler( async (req, res, next) => {
        let query = req.query || {};

        let pagination = this.FormatPagination(req.query)

        let params = this.moveTheSearchParamsFromTheQueryToNewObject(query);

        query = this.addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query);

        const resBootCamps = await this.db.getBootcamps(query, params);

        this.returnSuccessRespondToTheClientWithPage(res, 200, resBootCamps, pagination);
    })

    private FormatPagination(query)
    {
        if(!query) return {};

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 100;

        const endIndex = (page * limit);
        const startIndex = (page - 1) * limit;
        const total =  this.db.getBootcampAmount()
        const pagination:any = {};

        if(endIndex < total) 
            pagination.next = {page: page + 1, limit}
        
        if(startIndex > 0) 
            pagination.last = {page: page - 1, limit}

        return pagination;

    }

    private moveTheSearchParamsFromTheQueryToNewObject(query) {
        let params:any = {};
        const fieldsToExclude = ["select", "sort", "limit", "page"];
        fieldsToExclude.forEach(field => {
            params[field] = query[field] || "";
            delete query[field];
        });

        if(params.sort === "") params.sort = "-createdAt";

        return params;
    }

    private addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query: any) {
        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = JSON.parse(queryStr);
        return query;
    }

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