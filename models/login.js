var mongoose = require("mongoose");

var LoignSchema = new mongoose.Schema({
    email : String,
    password : String
})

module.exports = mongoose.model("Loign", LoignSchema);