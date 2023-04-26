const router =require('express').Router();
const {User,Product}=require('../models/Model')
const {uploadFarmerImages, uploadProductImages}= require('../config/multer');

router.get('/home', (req, res) => {
    res.render('dashboard/home.ejs',{user:req.user})
})

router.get('/farmer', (req, res) => {
    Product.findAll({where:{UserId:req.user.id}}).then((product)=>{
        console.log(product.length)
        res.render('dashboard/farmer.ejs',{user:req.user,email:req.body.email,product})
    }).catch((err)=>{
        console.log(err)
    })
})

router.get('/post', (req, res) => {
    res.render('dashboard/post.ejs',{user:req.user})
})

router.post('/post',uploadProductImages, async (req, res) => {
    console.log("Post page activated")
    console.log(req.files)

    const { productname, price,category, quality, size, grown, vitamins, calories, soil, origin, description ,shelflife,availability} = req.body;
    const UserId = req.user.id
    const productImg = req.files.productImg[0].path;

    try {
        // Create a new product instance with the form data and uploaded image path
        const newProduct = await Product.create({
            productname,
            category,
            quality,
            size,
            grown,
            vitamins,
            calories,
            soil,
            origin,
            description,
            price,
            productImg,
            UserId,
            shelflife,
            availability
        });
        if(newProduct){
            console.log("Post saved successfully")
            var data={
                'title':'success',
            }
            res.json(data);
        }else{
            console.log("Post wasnot saved")
            var data={
                'title':'failed',
            }
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        // res.status(500).send('Server Error');
        var data={
            'title':'failed',
        }
        res.json(data);
    }
});


module.exports=router;