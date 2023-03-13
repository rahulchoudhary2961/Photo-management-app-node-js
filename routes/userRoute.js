const express = require("express");
const user_route = express();
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require('path');
const session = require('express-session');

const config = require('../config/config')

user_route.use(session({secret:config.sessionSecret}));


const auth= require('../middleware/auth');

user_route.use(express.static('public'))

const storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload = multer({storage:storage});

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine','ejs')
user_route.set('views','./views/users')


const userController = require("../controllers/userController")

user_route.get('/',auth.isLogout, userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser);

user_route.get('/',auth.isLogout, userController.loginLoad);
user_route.get('/login',auth.isLogout, userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin, userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

user_route.get('/delete/:id',auth.isLogin, userController.removeImage);


module.exports = user_route;