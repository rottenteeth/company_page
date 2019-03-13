var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Product = require("../models/product");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");

//Index page
router.get("/", function(req, res){
    // Get all products from DB
    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            res.render("index", {products:allProducts});
        }
    });
});

router.get("/about", function(req, res){
    res.render("products/about");
})

//Authorization
//Go to the register page
router.get("/register", function(req, res){
    res.render("forms/register");
});

//Register new user
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("forms/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to RES-SMAK " + user.username);
            res.redirect("/");
        });
    });
});

//Login page
router.get("/login", function(req, res){
    res.render("forms/login");
});

//User Loggin In
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout form
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;