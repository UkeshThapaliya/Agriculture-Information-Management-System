const router =require('express').Router();

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs',{user:req.user})
})

router.get('/farmer', (req, res) => {
    res.render('dashboard/farmer.ejs',{user:req.user})
})

module.exports=router;