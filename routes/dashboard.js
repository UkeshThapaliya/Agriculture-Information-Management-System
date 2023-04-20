const router =require('express').Router();
const {User}=require('../models/Model')

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs',{user:req.user})
})

router.get('/farmer', (req, res) => {
    User.findAll({where:{role:"farmer"}}).then((farmer)=>{
        console.log(farmer.length)
        res.render('dashboard/farmer.ejs',{user:req.user,email:req.body.email,farmer})
    }).catch((err)=>{
        console.log(err)
    })
})

router.get('/post', (req, res) => {
    res.render('dashboard/post.ejs',{user:req.user})
})

router.post('/post', (req, res) => {
    console.log("Post page activated")
})

module.exports=router;