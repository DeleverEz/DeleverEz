var mongoose = require("mongoose");

var BookCourierSchema = new mongoose.Schema({
    sendername : String,
    receivername : String,
    senderphoneno : String,
    receiverphoneno : String,
    senderaddress : String,
    receiveraddress : String,
    sendercity : String,
    receivercity : String,
    detail : String,
    date : String,
    User : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    }

})

module.exports = mongoose.model("BookCourier", BookCourierSchema);