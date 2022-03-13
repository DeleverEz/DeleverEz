// Requiring all the packages
var express = require("express"),
    router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    methodOverride    = require("method-override"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    passport         = require("passport"),
    LocalStrategye     = require("passport-local");
    


// Requiring the middleware
var middleware = require("../middleware");
const Admin = require("../models/admin_signup");
var User = require("../models/signup");
  
var host = "http://localhost:3000/";

// Requiring the models


router.get('/' , isadminLoggedIn ,function(req,res){
    User.find({status : 'pending' } , function(err,Users){
        if(err){
            console.log(err)
        }else{
            console.log(Users);
            res.render('admin/index' , {users : Users})
        }
    })
})
router.get('/index',isadminLoggedIn  ,function(req,res){
    User.find({status : 'pending' } , function(err,Users){
        if(err){
            console.log(err)
        }else{
            console.log(Users);
            res.render('admin/index' , {users : Users})
        }
    })
})

router.post('/order/:id',  function (req, res) {
    User.findByIdAndUpdate( req.params.id , {status : "approved"}    ,function (err, dell) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin');
        }
    });
});

router.delete('/:id',  function (req, res) {
    User.findByIdAndRemove( req.params.id ,function (err, dell) {
        if (err) {
            console.log(err);
        } else {
            console.log('donw');
            res.redirect('/admin/index');
        }
    });
});

router.get('/register' , function(req,res){
    res.render('admin/sign-up');
})

router.post('/register', function (req, res) {
    Admin.register(new Admin({ username: req.body.username, email: req.body.email , role : 'Admin'}), req.body.password, function (err, Admin) {
        // console.log(User);
        if (err) {
            console.log(err);
            res.redirect('/register');
        }
        passport.authenticate('Admin')(req, res, function () {
            res.redirect('/admin');
        });
    });
});


router.get('/login' , function(req,res){
    res.render('admin/login');
})
// router.post("/login", function(req, res){
//     Admin.findOne({username: req.body.username}, function(err, admin){
//         console.log(admin);
//         if (admin.role == "Admin") {
//             passport.authenticate("Admin")(req, res, function(){
//                 console.log(passport.Authenticator)
//                 res.redirect("/admin");
//             })
//         }
//         else {
//             res.redirect("/admin/login");     
//         }
//     })
// });
router.post('/login' , function(req,res){
    Admin.findOne({username: req.body.username}, function(err, admin){
        if (admin.role == "Admin") {
            passport.authenticate("Admin")(req, res, function(){
                res.redirect("/admin/index");
            })
        }
        else {
            res.redirect("/admin/login");     
        }
    })
})
// router.post('/login', passport.authenticate('Admin', {
//     successRedirect: '/admin/index',
//     failureRedirect: '/admin/login'
// }), function (req, res) {
// });

// router.post("/login", function(req, res){
//     Admin.findOne({username : req.body.username}, function(err, admin){
//         if (admin.password == req.body.password) {
//             res.redirect('/index')
//         }
//         else {
//             res.redirect("/admin/login");     
//         }
//     })
// });


router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/admin');
    
})

function isadminLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.role !== 'User') {
        return next();
    }
    res.redirect("/admin/login");
}

module.exports = router;