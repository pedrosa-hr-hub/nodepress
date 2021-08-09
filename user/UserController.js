const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) =>{

     User.findAll().then(users =>{
          res.render("admin/users/index",{users: users});
     });
});

router.get("/admin/users/create", (req, res) =>{

     res.render("admin/users/create")
});

router.post("/user/create", (req, res) =>{

     //catch infos to frontend
     var email = req.body.email;
     var password = req.body.password;

     //validate
     User.findOne({where:{email:email}}).then ( user =>{
          if(user == undefined){ //email dont exists

               //create hash in password
               var salt = bcrypt.genSaltSync(10);
               var hash = bcrypt.hashSync(password, salt);
     
               User.create({

                    email: email,
     
                    password: hash

               }).then(()=>{

                    res.redirect("/");

               }).catch((err) => {

                    res.redirect("/");

               });
     

               }else{ //user exist

                  res.redirect("/admin/users/create");

               }
     });


     
});

router.get("/login", (req, res) =>{

     res.render("admin/users/login");

});

router.post("/authenticante", (req, res) =>{

     //catch infos from frontend
     var email = req.body.email;
     var password = req.body.password;

     //seach on database
     User.findOne({where: {email: email}}).then(user => {

          if(user != undefined){ //user exist

               //password validation
               var correct = bcrypt.compareSync(password, user.password);

               if(correct){
                    req.session.user = {
                         id: user.id,
                         email: user.email
                    }

                    res.redirect("/admin/articles")

               }else{
                    res.redirect("/login");
               }

          }else{
               res.redirect("/login");
          }
          

     })


});

router.get("/logout", (req, res) => {

     req.session.user = undefined;

     res.redirect("/");

})

module.exports = router;