var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var adminLoginSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : String

})
adminLoginSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", adminLoginSchema);