var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    username : String,
    phoneno : String,
    phonenosec : String,
    usercity : String,
    address : String,
    cnic_img : String,
    cnic : String,
    businessname : String,
    accounttype : String,
    previous_company : String,
    email : String,
    password : String,
    cnic_front : String,
    cnic_back : String,
    house_front : String,
    check_image : String,
    status : String,
    date : String,
    role : String,
    sellerid: String

})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);