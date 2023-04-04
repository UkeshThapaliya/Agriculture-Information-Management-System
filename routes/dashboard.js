const router =require('express').Router();

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs',{user:req.user})
})

router.get('/post', (req, res) => {
    res.render('dashboard/post.ejs',{user:req.user})
})
module.exports=router;