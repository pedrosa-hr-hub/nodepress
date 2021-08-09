// express
const express = require("express");
const app = express();

//express-session
const session = require("express-session");

//database and import class
const connection = require("./database/database");
connection
     .authenticate()
     .then(() => {
          console.log("DATABASE ONLINE");
     }).catch((error) =>{
          console.log(error);
     });
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");



//view engine
app.set("view engine", "ejs");

//session configure
app.use(session({

     secret: "jordan", cookie: {maxAge: 30000}

}));


//static
app.use(express.static("public"));

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//categories
const categoriesController = require("./categories/CategoriesController");
app.use("/", categoriesController);

//articles
const articlesController = require("./articles/ArticlesController");
app.use("/", articlesController);

//bcrypt
const brypt = require("bcryptjs");

//users
const userController = require("./user/UserController");
app.use("/", userController);

//routes
app.get("/", (req, res) =>{

     //catch info on database
     Article.findAll({
          order:[
               ['id', 'DESC'] //ordenation render
          ],
          limit: 4
     }).then(articles =>{

          Category.findAll().then(categories =>{ //auto fill to navbar
               res.render("index", {articles: articles, categories: categories});
          });

     })
     
});

app.get("/:slug", (req, res)=>{

     //catch slug in URL
     var slug = req.params.slug;

     //seach on database and send to front end
     Article.findOne({

          where: {
               slug: slug
          }

     }).then(article =>{

          if(article != undefined){

               Category.findAll().then(categories =>{ //auto fill to navbar
                    res.render("article", {article: article, categories: categories});
               }); //render front and send data by article

          }else{
               res.redirect("/");
          }

     }).catch( err => {
          console.log('Ocorreu um erro: '+error);
          res.redirect("/");
     });

});

app.get("/category/:slug", (req, res) => {
     var slug = req.params.slug;
     Category.findOne({
         where: {
             slug: slug
         },
         include: [{model: Article}] //Serve como um join para ligar category e article
     }).then(category => {
         if(category != undefined){
             Category.findAll().then(categories => {
                 res.render('index', {articles: category.articles, categories: categories});
             });
         } else {
             res.redirect('/');
         }
     }).catch(error => {
         res.redirect('/');
     });
 });

//server
app.listen(8080, () => {
     console.log("SERVER ONLINE!");
})