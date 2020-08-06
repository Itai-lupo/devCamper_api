const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))
        .catch(next);

module.exports = asyncHandler; 




//if(e.statusCode) return next(e);
//next(new ErrorResponse(e.message, 400));
