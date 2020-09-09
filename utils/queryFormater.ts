export default function formatQueryAndGetPagination(query, totalElements)
{
    const pagination = FormatPagination(query, totalElements);
    const params = moveTheSearchParamsFromTheQueryToNewObject(query);
    const formatQuery = addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query);

    return {pagination, params, formatQuery};

}


function FormatPagination(query, total)
{
    if(!query) return {};

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100;

    const endIndex = (page * limit);
    const startIndex = (page - 1) * limit;
    const pagination:any = {};

    if(endIndex < total) 
        pagination.next = {page: page + 1, limit}
    
    if(startIndex > 0) 
        pagination.last = {page: page - 1, limit}

    return pagination;

}

function moveTheSearchParamsFromTheQueryToNewObject(query) {
    let params:any = {};
    const fieldsToExclude = ["select", "sort", "limit", "page"];
    fieldsToExclude.forEach(field => {
        params[field] = query[field] || "";
        delete query[field];
    });

    if(params.sort === "") params.sort = "-createdAt";

    return params;
}

function addDollarSignAtTheBeginingOfAllTheQuryComparisonOperators(query: any) {
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = JSON.parse(queryStr);
    return query;
}

