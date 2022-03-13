var mongoose = require("mongoose");

var userDetailsSchema = new mongoose.Schema({
    city: String,
    country : String,
    gender : String,
    contact : String,
    jobName : String,
    jobExperience : String,
    skills : [

    ],
    about : String,
    User : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        projectname: String,
    },
    assignedTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
})

module.exports = mongoose.model("UserDetails", userDetailsSchema);