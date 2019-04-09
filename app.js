var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride   = require('method-override');
var flash = require("connect-flash");
var Product = require("./models/product");
var User = require("./models/user");

const uri = "mongodb+srv://rottenteeth:modecom12@company-psphb.mongodb.net/test?retryWrites=true";

//requiring routes
var commentRoutes    = require("./routes/comments"),
    productRoutes   = require("./routes/products"),
    indexRoutes     = require("./routes/index");

//DB CONNECT
// mongoose.connect("mongodb://localhost/company", { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://rottenteeth:modecom12@company-psphb.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

process.env.DATABASEURL;

//APP SETUP
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);

module.exports = app;
