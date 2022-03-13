// Requiring all the packages
var express = require("express"),
    router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    LocalStrategy = require('passport-local'),
    invNum = require('invoice-number'),
    moment  = require('moment'), // For Current Date 
    shortid = require('shortid');

// Requiring the middleware
var middleware = require("../middleware");
const BookCourier = require("../models/BookCourier");
const BookCod = require("../models/BookCod");
var User = require("../models/signup");

var multer            = require("multer");
var path   = require('path');
const { Script } = require("vm");

var orderkey ;
//Upload Image CNIC
const storage2 = multer.diskStorage({
    destination: 'public/assets/images/userimg/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
   
var upload2 = multer({ storage: storage2 });

var host = "http://localhost:3000/";

// Requiring the models
router.get('/' , function(req,res){
    console.log(req.user)
    res.redirect('/home')
})

router.get('/home' , function(req,res){
    res.render('user/index')
})


router.get('/register' , function(req,res){
    res.render('user/sign-up');
})
router.post('/register', upload2.fields([{
    name: '', maxCount: 1
  }, {
    name: 'cnicf', maxCount: 1
  }, {
    name: 'cnicb', maxCount: 1
  }, {
    name: 'check', maxCount: 1
  }, {
    name: 'shop', maxCount: 1
  }]) ,function (req, res) {
    console.log(req.body.username)
    User.register(new User({ 
        username: req.body.username,
        lastname: req.body.lastname,
        email: req.body.email,
        phoneno: req.body.phoneno,
        phonenosec: req.body.phonenosec,
        usercity : req.body.usercity,
        cnic: req.body.cnic,
        businessname: req.body.businessname,
        accounttype: req.body.accounttype,
        address : req.body.address,
        status : 'pending',
        role : 'User',
        date : moment().format('MMMM Do YYYY'),
        sellerid: shortid.generate(),
    }), req.body.password, function (err, User) {
        console.log(User);
        if (err) {
            console.log(err);
            res.redirect('/register');
        }
        else{
            // console.log(User.sellerid)
            if(User.accounttype == 'business'){
                User.cnic_front = req.files.cnicf[0].originalname;
                User.cnic_back = req.files.cnicb[0].originalname;
                User.check_image = req.files.check[0].originalname;
                User.house_front = req.files.shop[0].originalname;
                // User.previous_company = req.body.previous_company;
                User.save();
                console.log(User)
                passport.authenticate('User')(req, res, function () {
                    res.redirect('/');
                });
            }
            else{
                passport.authenticate('User')(req, res, function () {
                    res.redirect('/');
                });
            }
            
        }
       
    });
});
router.get('/login' , function(req,res){
    res.render('user/login');
})
// router.post("/login", function(req, res){
//     User.findOne({username: req.body.username}, function(err, user){
//         if (user.role == "User") {
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/");
//             })
//         }
//         else {
//             res.redirect("/login");     
//         }
//     })
// });
router.post('/login' , function(req,res){
    User.findOne({username: req.body.username}, function(err, user){
        if (user.role == "User") {
            passport.authenticate("User")(req, res, function(){
                res.redirect("/");
            })
        }
        else {
            res.redirect("/login");     
        }
    })
})
// router.post('/login', passport.authenticate('User', {
//     successRedirect: '/',
//     failureRedirect: '/login'
// }), function (req, res) {
// });
router.get('/method', isuserLoggedIn ,  function(req,res){
    
    res.render('user/method')
})
router.get('/order-success', isuserLoggedIn , function (req, res) {
    res.render('user/orderSuccess');
    
})
router.get('/book-a-courier', isuserLoggedIn , function(req,res){
    
    res.render('user/book-a-courier')
})


router.post('/book-a-courier' , isuserLoggedIn , function(req,res){
    var bookcourier = {
        sendername : req.body.sendername,
        receivername : req.body.receivername,
        senderphoneno : req.body.senderphoneno,
        receiverphoneno : req.body.receiverphoneno,
        senderaddress : req.body.senderaddress,
        receiveraddress : req.body.receiveraddress,
        sendercity : req.body.sendercity,
        receivercity : req.body.receivercity,
        detail : req.body.detail,
        date : moment().format('MMMM Do YYYY'),
        
    };
    BookCourier.create(bookcourier , function(err , bookcourier){
        if(err){
            console.log(err)
        }else{
            bookcourier.User.id = req.user._id,
            console.log(bookcourier)
            res.redirect('/home');
        }
    })
})

router.get('/book-a-cod' ,isuserLoggedIn, function(req,res){
    res.render('user/book-a-cod')
})
router.post('/book-a-cod',  function(req,res){
    var bookscod = {
        customername : req.body.customername,
        customerphoneno : req.body.customerphoneno,
        weight  : req.body.weight,
        ordertype : req.body.ordertype,
        destinationcity  : req.body.destinationcity,
        deliverycharges : req.body.deliverycharges,
        deliverytype : req.body.deliverytype,
        customeraddress : req.body.customeraddress,
        details : req.body.details,
        date : moment().format('MMMM Do YYYY'),
        orderid : new Date().getTime().toString(),
    };
    BookCod.create(bookscod , function(err , bookcod){
        if(err){
            console.log(err)
        }else{
            if(bookcod.ordertype == 'cod'){
                bookcod.codammount = req.body.codammount;
                bookcod.User.id = req.user._id;
                bookcod.User.username = req.user.username;
                bookcod.save();
                res.render('user/orderSuccess', {orderid : bookcod.orderid});
            }
            else{
                bookcod.User.id = req.user._id;
                bookcod.User.username = req.user.username;
                bookcod.save();
                orderkey = bookcod.orderid;
                res.render('user/orderSuccess', {orderid : bookcod.orderid});
                
            }
            orderkey = bookcod.orderid;
        }
    })
})
router.get('/order-success', isuserLoggedIn , function (req, res) {
    res.render('user/orderSuccess'); 
})
router.get('/pdf' , isuserLoggedIn , function (req, res) {
    BookCod.findOne({'orderid' : orderkey} , function(err, bookcod){
        if(err){
            console.log(err)
        }else{
            User.findById(req.user._id  , function(err,user){
                if(err){
                    console.log(err)
                }else{
                    console.log(user);
                    res.render('user/pdf' , {bookcod : bookcod , user : user}); 
                }
            })
        }
    })
})
router.get('/contact', function (req, res) {
    res.render('user/contact');
    
})
router.get('/profile', isuserLoggedIn ,function (req, res) {
    User.findById(req.user._id , function(err , user){
        if(err){
            console.log(user)
        }else{
            BookCod.find({'User.id' : req.user.id} , function(err , bookcods){
                if(err){
                    console.log(err)
                }else{
                    console.log(bookcods)
                   res.render('user/profile' , {bookcod : bookcods , user : user});
                }
            })
        }
    })
    
})
router.get('/profile/order-history', isuserLoggedIn ,  function (req, res) {
    User.findById(req.user._id , function(err , user){
        if(err){
            console.log(user)
        }else{
            BookCod.find({'User.id' : req.user.id} , function(err , bookcods){
                if(err){
                    console.log(err)
                }else{
                    console.log(bookcods)
                   res.render('user/order' , {bookcods : bookcods , user : user});
                }
            })
        }
    })
    
})
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
    
})

function isuserLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'User') {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;