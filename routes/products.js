var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Index page to show all products
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

//Creating new product
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to products array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newProduct = {name: name, price: price, image: image, desc: desc, author:author}
    // Create a new product and save to DB
    Product.create(newProduct, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to products page
            console.log(newlyCreated);
            res.redirect("/");
        }
    });
});

//Form to create new product
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("products/new");
});

//More info about product
router.get("/:id", function(req, res){
    //find the product with provided ID
    Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            console.log(foundProduct);
            //render show template with that product
            res.render("products/show", {product: foundProduct});
        }
    });
});

router.get("/:id/edit", middleware.checkProductOwnership, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
            res.render("products/edit", {product: foundProduct});
    });
});

//Update product
router.put("/:id", middleware.checkProductOwnership, function(req, res){
    // find and update the correct product
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
        if(err){
            res.redirect("/");
        } else {
            //redirect somewhere(show page)
            res.redirect("/products/" + req.params.id);
        }
    });
});

//Delete product from DB
router.delete("/:id",middleware.checkProductOwnership, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});


module.exports = router;

