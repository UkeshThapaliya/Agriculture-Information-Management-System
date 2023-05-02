const router =require('express').Router();
const {User,Product,Message}=require('../models/Model')
const {uploadFarmerImages, uploadProductImages}= require('../config/multer');

// router.get('/home', async(req, res) => {

//     const vegetables = await Product.findAll({ where: { category: "Vegetable" },include: { model: User} })
//     const fruits = await Product.findAll({ where: { category: "Fruits" },include: { model: User}  })
//     const cashCrops = await Product.findAll({ where: { category: "Cash crops" } ,include: { model: User} })
//     const foodCrops = await Product.findAll({ where: { category: "Food crops" } ,include: { model: User} })
//     const dairyProducts = await Product.findAll({ where: { category: "Dairy" } ,include: { model: User} })
//     const nonVegProducts = await Product.findAll({ where: { category: "Non-veg" } ,include: { model: User} })
    
//     res.render('dashboard/home.ejs',{user:req.user,vegetables: vegetables, fruits: fruits ,cashCrops: cashCrops, foodCrops: foodCrops, dairyProducts: dairyProducts, nonVegProducts: nonVegProducts})
// })
router.get('/home', async (req, res) => {
    const userId = req.user.id;
    const product =await Product.findAll()
    const farmer =await User.findAll()
    const vegetables = await Product.findAll({
        where: { category: "Vegetable", userId },
        include: { model: User }
    });

    const fruits = await Product.findAll({
        where: { category: "Fruits", userId },
        include: { model: User }
    });

    const cashCrops = await Product.findAll({
        where: { category: "Cash crops", userId },
        include: { model: User }
    });

    const foodCrops = await Product.findAll({
        where: { category: "Food crops", userId },
        include: { model: User }
    });

    const dairyProducts = await Product.findAll({
        where: { category: "Dairy", userId },
        include: { model: User }
    });

    const nonVegProducts = await Product.findAll({
        where: { category: "Non-veg", userId },
        include: { model: User }
    });

    res.render('dashboard/home.ejs', {
        user: req.user,
        farmer,
        product,
        vegetables,
        fruits,
        cashCrops,
        foodCrops,
        dairyProducts,
        nonVegProducts
    });
});

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

router.get('/message', async(req, res) => {
    const message= await Message.findAll({where:{UserId:req.user.id}})
    res.render('dashboard/message.ejs',{user:req.user,message:message});
})

router.get('/setting', (req, res) => {
    res.render('dashboard/setting.ejs',{user:req.user})
})

router.post('/setting',(req, res)=>{
    User.findOne({where: {email: req.body.email}}).then((user)=>{
        if (user){
            console.log(req.body)
            User.update({
                // email:req.body.email,
                name:req.body.name,
                phoneNumber:req.body.phoneNumber,
                address:req.body.address,
            },{where:{email:req.body.email}}
            ).then(() => {
                res.json("changesucess")
                console.log('Updated Profile successfully');
            })
        } else{
            res.json("Error")
        }

    })
})

module.exports=router;