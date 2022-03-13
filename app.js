// Requiring all the packages

var express           = require("express"),
    app               = express(),
    methodOverride    = require("method-override"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    MongoStore        = require('connect-mongo'),
    flash             = require("connect-flash");


var Session     = require('express-session');
// Connecting to mongo db database
// mongoose.connect('mongodb://localhost/deliverez', {useNewUrlParser: true , useUnifiedTopology: true});

// mongoose.connect('mongodb+srv://noman:noman54321@cakes-pastry.fzbte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://hassandatabase:g8uzZIj45rZ0bZjW@cluster0.yupb0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://deliverez:deliverez1997@cluster0.43gki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true , useUnifiedTopology: true});

// session getting defined
app.use(Session({
    secret: "Nothing",
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongoUrl : 'mongodb+srv://hassanmongodb:g8uzZIj45rZ0bZjW@cluster0.yupb0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' }),
    cookie: { maxAge: 100 * 100 * 1000 } 
}));


// Enable the app to use different packages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));

// Requiring all the models
var user = require('./models/signup');
var admin = require('./models/admin_signup');

// passport is setting up user 

passport.use('User',new LocalStrategy(user.authenticate()));
passport.use('Admin',new LocalStrategy(admin.authenticate()));
passport.serializeUser((user,done)=>{
    done(null,user);
});
passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
  });
// passport.deserializeUser(admin.deserializeUser());

// using session
app.use(function(req, res, next){
    res.locals.CurrentUser = req.user;
    res.locals.CurrentAdmin = req.admin;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    req.email;
    next();
})


// Set the app view engine
app.set("view engine", "ejs");

// Requiring all the routes
var indexRoutes       = require("./routes/index");
var adminRoutes       = require("./routes/admin");

// Enable the app to use the routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);

// Enable the app to listen to the port to run on the localhost as well as on the server
app.listen(process.env.PORT || 3000, function(){
    console.log("The server has started");
})