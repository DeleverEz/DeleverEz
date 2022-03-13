var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    teamname : String,
    project : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        projectname: String,
    },
    projectManager : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    teammember: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
})

module.exports = mongoose.model("Room", commentSchema);