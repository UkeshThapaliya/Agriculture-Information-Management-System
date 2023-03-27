const router =require('express').Router();

router.get('/', (req, res) => {
    res.render('home/home.ejs')
})

router.get('/product', (req, res) => {
    res.render('home/product.ejs')
})

router.get('/home', (req, res) => {
    res.render('home/index.ejs')
})

router.get('/login', (req,res)=>{
    res.render('home/login.ejs')
})

router.get('/register', (req,res)=>{
    res.render('home/register.ejs')
})

router.post('/register', (req,res)=>{
    console.log(req.body)
})



module.exports=router;