const router =require('express').Router();
const {User}= require('../models/Model')
const bcrypt = require('bcrypt');
const passport = require('passport');

const db=require('../connection')

function loggedIn(req,res,next){
    if(req.user){
        next()
    }else{
        res.redirect('/login')
        console.log("to the login page")
    }
}

function isguest(req, res, next){
    if(req.user){
        res.redirect('/dashboard/home');
    }else{
        next()
    }
}

router.get('/', (req, res)=>{
    if( req.isAuthenticated()){
        return res.render('home/home.ejs', {auth: true, user: req.user})
    }
    res.render('home/home.ejs', {auth: false})
})

router.get('/product', isguest,(req, res) => {
    res.render('home/product.ejs',{ auth: false})
})


router.get('/login',isguest, (req,res)=>{
    res.render('home/login.ejs',{ auth: false})
})

router.post('/login',isguest,(req, res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(info != undefined && info.message=='no info'){
            var data={
                'title':'no user',
            }
            return res.json(data)
        }
        if(user){
            req.logIn(user,(err,info)=>{
                var data={
                    'title':'success login',
                    'user':user
                }
                res.json(data)
            })
        }else{
            var data={
                'title':'error',
            }
            res.json(data)
        }
    })(req, res,next)
})

router.get('/register', isguest,(req,res)=>{
    res.render('home/register.ejs',{auth: false})
})

router.post('/register' ,isguest,(req, res)=>{
    console.log("hi")
    // console.log(req.body)
    let email = req.body.email
    if (email === undefined) {
        email = 'default value';
    }
    User.findOne({where: {email: email}}).then(async(user)=>{
        console.log(user)
        if(user){
            var data={
                'title':'UserExist'
            }
            res.json(data);
            console.log(data)
        }else{
            const hash=await bcrypt.hash(req.body.password,10)

            var user = new User({
                name:req.body.name,
                registerNo:req.body.registerNo,
                phoneNumber:req.body.phoneNumber,
                email:req.body.email,
                country:req.body.country,
                password:hash
            });

            user.save().then((newuser)=>{
                console.log("User saved in database");
                var data={
                    'title':'success',
                    // 'email':req.body.email
                }
                res.json(data);
            console.log(data)
            })
        }
    })
})

router.get('/logout',function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect("/")
    })
})

module.exports=router;