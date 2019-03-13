var express = require("express");
var router  = express.Router();
var Product = require("../models/product");

//Get the page to edit product
router.get("/:id/edit",function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("edit", {product: product});
        }
    });
});

//Product update
router.put("/:id", function(req, res){
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, product){
        if(err){
            console.log(err);
        } else {
            var showUrl = "/products/" + product._id;
            res.redirect(showUrl);
        }
    });
});

//Product delete
router.delete("/:id", function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
            product.remove();
            res.redirect("/");
        }
    });
});

module.exports = router;