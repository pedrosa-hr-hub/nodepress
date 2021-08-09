//express

const express = require("express");
const router = express.Router();

//create slug's

const slugify = require("slugify");
const { route } = require("../articles/ArticlesController");


//import model database

const Category = require("./Category");

//import middleware
const adminAuth = require("../middlewares/adminAuth");


//routes

router.get("/admin/categories/new", adminAuth, (req, res) =>{

     res.render("admin/categories/new");

});

router.post("/categories/save", adminAuth, (req, res) =>{

     //catch info
     var title = req.body.title;

     //verify and safe

     if(title != undefined){

          Category.create({

               title: title,

               //transforming string in slug

               slug: slugify(title)

          }).then(() => {

               res.redirect("/admin/categories");

          })

     }else{

          res.redirect("/admin/categories/new");

     }

});

router.get("/admin/categories", adminAuth, (req, res) =>{

     Category.findAll().then(categories =>{

          res.render("admin/categories/index", {categories: categories});

     });

     
});

router.post("/categories/delete", adminAuth, (req, res) =>{
     
     //catch info
     var id = req.body.id;

     //verify and delete
     if(id != undefined){

          if(!isNaN(id)){

               Category.destroy({

                    where: {

                         id: id

                    }

               }).then(()=>{

                    res.redirect("/admin/categories");
                    
               })

          }else{

               res.redirect("/admin/categories");

          }

     }else{
               res.redirect("/admin/categories");
     }
});

router.get("/admin/categories/edit/:id", adminAuth, (req, res) =>{

     var id = req.params.id;

     //check if id is the number
     if(isNaN(id)){

          res.redirect("/admin/categories");

     }

     //find category and select
     Category.findByPk(id).then(category =>{

          if(category != undefined){

               res.render("admin/categories/edit", {category:category});

          }else{
               res.redirect("/admin/categories");
          }
     }).catch(erro =>{
          res.redirect("/admin/categories");
     });

});

router.post("/categories/update", adminAuth, (req, res) => {
     
     //catch info to update
     var id = req.body.id;
     var title = req.body.title;

     //update by id
     Category.update({title: title, slug: slugify(title)}, {

          where:{
               id:id
          }
     }).then(()=>{
          res.redirect("/admin/categories");
     });
});


module.exports = router;