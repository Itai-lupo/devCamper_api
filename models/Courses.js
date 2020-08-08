const mongoose = require("mongoose");

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

module.exports = mongoose.model("Courses", coursesSchema);