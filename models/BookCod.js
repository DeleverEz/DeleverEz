var mongoose = require("mongoose");

var BookSellerSchema = new mongoose.Schema({
    customername : String,
    customerphoneno : String,
    ordertype : String,
    codammount : String,
    weight : String,
    destinationcity : String,
    deliverycharges : String,
    customeraddress : String,
    deliverytype : String,
    details : String,
    orderid : String,
    date : String,
    User : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },

})

module.exports = mongoose.model("BookSeller", BookSellerSchema);