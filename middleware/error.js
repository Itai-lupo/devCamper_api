function errorHandler(err, req, res, next)
{
    console.log(err.stack);

    if(err.code === 11000 || err.name === "ValidationError")
    {
        err.statusCode = 400
    }

    res.status(err.statusCode || 500).json({
        success: false,
        err: err.message || "server error"
    })
}

module.exports = errorHandler;