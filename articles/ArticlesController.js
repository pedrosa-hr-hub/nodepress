//express
const express = require("express");
const router = express.Router();

//slug generetor
const slugify = require("slugify");


//import category
const Category = require("../categories/Category");
const Article = require("./Article");

//import middleware
const adminAuth = require("../middlewares/adminAuth");

//routes

router.get("/admin/articles", adminAuth, (req, res) =>{

     //send data to database
     Article.findAll({
          include:[{model:Category, required: true}]
     }).then(articles =>{
          res.render("admin/articles/index", {articles: articles}); //send to front end
     });
     

});

router.get("/admin/articles/new", adminAuth, (req, res) =>{

     //seach on database
     Category.findAll().then(categories =>{
          res.render("admin/articles/new", {categories: categories}); //send data to front end
     })
     
});

router.post("/articles/save", adminAuth, (req, res) =>{

     //catch infos
     var title = req.body.title;
     var body = req.body.body;
     var category = req.body.category;

     //save on database and redirect to main
     Article.create({
          title: title,
          slug: slugify(title),
          body: body,
          categoryId: category
     }).then(()=>{
          res.redirect("/admin/articles");
     });


});

router.post("/articles/delete", adminAuth, (req, res) =>{
     
     //catch info
     var id = req.body.id;

     //verify and delete
     if(id != undefined){

          if(!isNaN(id)){

               Article.destroy({

                    where: {

                         id: id

                    }

               }).then(()=>{

                    res.redirect("/admin/articles");
                    
               })

          }else{

               res.redirect("/admin/articles");

          }

     }else{
               res.redirect("/admin/articles");
     }
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) =>{

     //catch info from frontend
     var id = req.params.id;

     //seach on database
     Article.findByPk(id).then(article =>{
          //verify
          if(article != undefined){

               Category.findAll().then(categories =>{

                    res.render("admin/articles/edit", {article: article, categories: categories});

               });

               

          }else{

               res.redirect("/");

          }


     }).catch(err =>{

          res.redirect("/");

     })
});

router.post("/articles/update", adminAuth, (req, res) =>{

     //catch info from frontend
     var id = req.body.id;
     var title = req.body.title;
     var body = req.body.body;
     var category = req.body.category;

     //save in database
     Article.update({
          title:title,
          body:body,
          categoryId:category,
          slug:slugify(title)
     },{
          where: { //seach on data per id
               id:id
          }
     }).then(()=>{

          res.redirect("/admin/articles");
     
     }).catch(err =>{

          res.redirect("/");

     });

});


router.get("/articles/page/:num", (req, res) =>{

     //catch info to URL
     var page = req.params.num;
     //define offset
     var offset = 0;

     //offset dynamic
     if(isNaN(page) || page == 1){

          offset = 0;
     
     }else{
          offset = (parseInt(page) -1) * 4;
     }

     //seach and count on database
     Article.findAndCountAll({ 
          limit: 4, 
          offset: offset,
          order:[
               ['id', 'DESC'] //ordenation render
          ]
           }).then(articles =>{

               

               var next;

               if(offset + 4 >= articles.count){
                    next = false;
               }else{
                    next = true;
               }

               var result = {
                    page: parseInt(page),
                    next:next,
                    articles:articles
               }

                    //add category on navbar
                    Category.findAll().then(categories =>{

                         res.render("page", {result: result, categories:categories});

                    });

          });

});


module.exports = router;