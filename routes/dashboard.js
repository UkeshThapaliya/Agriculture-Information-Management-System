const router =require('express').Router();

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs')
})

module.exports=router;