import asyncHandler  = require("../utils/async");

export default class coursesLogic
{
    private db;

    constructor(db)
    {
        this.db = db;
    }
}