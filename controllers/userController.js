const User = require('../models/userModels');
const bcrypt = require('bcrypt');

const fs = require('fs');
const path = require('path');
const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }

}

const loadRegister = async (req, res, next) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async (req, res, next) => {

    try {
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
        });

        const userData = await user.save();

        if (userData) {
            res.render('login', { message: "registration sucessfull." });
           
        }
        else {
            res.render('registration', { message: "your registration has been failed" });
        }

    } catch (error) {
        console.log(error.message);
    }
}

//login user 

const loginLoad = async (req, res, next) => {
    try {
        res.render('login.ejs')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin  = async (req,res,next) => {

    try {

        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
          const passwordMatched= await  bcrypt.compare(password, userData.password)
          if(passwordMatched){
            req.session.user_id = userData._id;
            res.redirect('home');
          }
          else {
            res.render('login.ejs', { message: "email and password is incorrect" })
        }

        }
        else {
            res.render('login.ejs', { message: "email and password is incorrect" })
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const loadHome=async(req,res)=>{
    try{
      const userData =  await User.findById({_id:req.session.user_id});
  
        res.render('home', {user:userData})
    }
    catch(error){
        console.log(error.message);
    }
}

const userLogout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/login')

    }catch (error){
        console.log(error.message);
    }
}
const removeImage= async (req, res) => {
    try{
    let id = req.params.id;
    console.log(id);
    const userData =  await User.findById({_id:id});
    const image = userData.image;
    await User.findByIdAndUpdate(id, {"image": ""})
    .then((updateData) =>{
        try{
        fs.unlinkSync(path.join(__dirname, "..", "public", "userImages", image));
        console.log("Image deleted successfully!");
        }
        catch(e){
            console.log("failed to remove image");
        }
        res.redirect("/home");
    });
    }
    catch (e){
        console.log(e);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    removeImage
}