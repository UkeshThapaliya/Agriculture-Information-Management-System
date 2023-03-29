const router =require('express').Router();

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs',{user:req.user})
})

module.exports=router;