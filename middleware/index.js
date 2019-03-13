var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkProductOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Product.findById(req.params.id, function(err, foundProduct){
            if(err){
                req.flash("error", "Product not found");
                res.redirect("back");
            }  else {
                // does user own the product?
                if(foundProduct.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;