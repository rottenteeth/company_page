var express = require("express");
var router  = express.Router({mergeParams: true});
var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Get the page to add new comment
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find product by id
    console.log(req.params.id);
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {product: product});
        }
    })
});

//Post new comment
router.post("/",middleware.isLoggedIn,function(req, res){
    //lookup product using ID
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    product.comments.push(comment);
                    product.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect('/products/' + product._id);
                }
            });
        }
    });
});

//Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            // find product by id
            console.log(req.params.id);
            Product.findById(req.params.id, function(err, product){
                if(err){
                    console.log(err);
                } else {
                    res.render("comments/edit", {product_id: req.params.id, comment: foundComment, product: product});
                    // res.render("comments/edit", {product: product});
                }
            });

        }
    });

});

//Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/products/" + req.params.id );
        }
    });
});

//Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/products/" + req.params.id);
        }
    });
});

module.exports = router;