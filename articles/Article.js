//sequelize and connection import
const Sequelize = require("sequelize");
const connection = require("../database/database");
//relationship
const Category = require("../categories/Category");

//structure of article on database
const Article = connection.define("articles",{
     
     title:{
          type: Sequelize.STRING,
          allowNull: false
     }, 
     slug:{
          type: Sequelize.STRING,
          allowNull: false
     },
     body:{
          type: Sequelize.TEXT,
          allowNull: false
     }
});

//1 to multiple relationship
Category.hasMany(Article);

//1 to 1 relationship
Article.belongsTo(Category);

//Article.sync({force: true});

module.exports = Article;