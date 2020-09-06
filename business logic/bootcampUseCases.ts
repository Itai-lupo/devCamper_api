import asyncHandler  = require("../utils/async");

export default class coursesLogic
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

        const total = this.db.getBootcampAmount()

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
        let id = req.params.id;       

        const resBootCamps = await this.db.getBootcamp(id);

        this.returnSuccessRespondToTheClient(res, 200, resBootCamps);
    })



    private returnSuccessRespondToTheClient(res, status, data)
    {
        res.status(status).json({
            success: true,
            data
        });
    }

    private returnSuccessRespondToTheClientWithPage(res, status, data, pagination)
    {
        res.status(status).json({
            success: true,
            data,
            pagination
        });
    }
}