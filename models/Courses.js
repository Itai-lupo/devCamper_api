const mongoose = require("mongoose");
const Bootcamps = require("./Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

const coursesSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, "please add course title"]

    },
    description:{ 
        type:String,
        required: [true, "please add course description"]
    },
    weeks:{
        type: Number,
        required: [true, "please add number of weeks"]
    },
    tuition:{
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill:{
        type: String,
        required: [true, "Please add a minimum skill"],
        enum: ["beginner", "intermediate", "advanced"] 
    },
    scholarhipsAvailable:{
        type: Boolean,
        default: false
    },
    createdAt: {
    type: Date,
    default: Date.now
    },
    bootcamp:{
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

coursesSchema.pre('save', async function(next){
    const bootcamp = await Bootcamps.findById(this.bootcamp);
    if(!bootcamp){
        throw new ErrorResponse(`no bootcamp with id: ${this.bootcamp}, please use valid bootcamp id`, 404);
    }

    next();
})

module.exports = mongoose.model("Courses", coursesSchema);