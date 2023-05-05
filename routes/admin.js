const router =require('express').Router();
const {User,Product,Message}=require('../models/Model')
const {uploadFarmerImages, uploadProductImages}= require('../config/multer');

function loggedIn(req,res,next){
    if(req.user){
        if(req.user.role == 'admin') 
            return next()
    }else{
        res.redirect('/login')
        console.log("to the login page")
    }
}

router.get('/home', loggedIn, async (req, res) => {
    const product = await Product.findAll();
    const farmer = await User.findAll();
    const vegetables = await Product.findAll({
        where: { category: "Vegetable" },
        include: { model: User }
    });

    const fruits = await Product.findAll({
        where: { category: "Fruits" },
        include: { model: User }
    });

    const cashCrops = await Product.findAll({
        where: { category: "Cash crops" },
        include: { model: User }
    });

    const foodCrops = await Product.findAll({
        where: { category: "Food crops" },
        include: { model: User }
    });

    const dairyProducts = await Product.findAll({
        where: { category: "Dairy" },
        include: { model: User }
    });

    const nonVegProducts = await Product.findAll({
        where: { category: "Non-veg" },
        include: { model: User }
    });

    res.render('adminDashboard/home.ejs', {
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


router.get('/farmer', loggedIn, (req, res) => {
    User.findAll({
        where: {
            role: 'farmer'
        }
    }).then((farmers) => {
        console.log(farmers.length);
        res.render('adminDashboard/farmer.ejs', {
            user: req.user,
            email: req.body.email,
            farmers
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/post', loggedIn, (req, res) => {
    Product.findAll({
        include: { model: User }
    }).then((product) => {
        console.log(product.length);
        res.render('adminDashboard/post.ejs', {
            user: req.user,
            email: req.body.email,
            product
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/setting',loggedIn, (req, res) => {
    res.render('adminDashboard/setting.ejs',{user:req.user})
})

router.post('/setting',loggedIn,(req, res)=>{
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

router.post('/setting/profileImage',uploadFarmerImages, loggedIn,(req, res)=>{
    console.log(req.files.profile[0].path)
        console.log(req.body)
        console.log(req.file)
        User.update({
            profileImg: req.files.profile[0].path
        
        },{where:{email:req.body.email}}
        ).then(() => {
            res.redirect('/adminDashboard/setting')
        })

})

router.get('/product/:id/delete',loggedIn,(req, res)=>{
    console.log(req.params.id)
        Product.destroy({where: {id: req.params.id}}).then(()=>{
            console.log("product has been deleted")
            res.redirect("back")
        })
})

router.get('/farmers/:id/delete',loggedIn,(req, res)=>{
    console.log(req.params.id)
    Message.destroy({where: {UserId: req.params.id}}).then(()=>{
        Product.destroy({where: {UserId: req.params.id}}).then(()=>{
            User.destroy({where: {id: req.params.id}}).then(()=>{
                console.log("User and it's message, product deleted")
                res.redirect("back")
        })
    })
})

})





module.exports=router;