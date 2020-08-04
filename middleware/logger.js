const loggr = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.url}`);
    
    next();
}

module.exports = loggr;