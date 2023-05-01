const router =require('express').Router();
const {User, Categories,Product,Message}= require('../models/Model')
const bcrypt = require('bcrypt');
const passport = require('passport');
const {Op}=require('sequelize')


const db=require('../connection')

function loggedIn(req,res,next){
    if(req.user){
        next()
    }else{
        res.redirect('/login')
        console.log("to the login page")
    }
}

//middleware for checking the user
function isguest(req, res, next){
    if(req.user){
        res.redirect('/dashboard/home');
    }else{
        next()
    }
}

//route for the landing page or home page
router.get('/', (req, res)=>{
    if( req.isAuthenticated()){
        return res.render('home/home.ejs', {auth: true, user: req.user})
    }
    res.render('home/home.ejs', {auth: false})
})


//rout for login page
router.get('/login',isguest, (req,res)=>{
    res.render('home/login.ejs',{ auth: false})
})

// login page backend
router.post('/login',isguest,(req, res,next)=>{
    // Use Passport.js to authenticate user credentials.
    passport.authenticate('local',(err,user,info)=>{
        // If there is no info or the message is 'no info', return a 'no user' error message.
        if(info != undefined && info.message=='no info'){
            var data={
                'title':'no user',
            }
            console.log("There is no user with given email address")
            return res.json(data)
        }
        // If user credentials are correct, log in the user.
        if(user){
            req.logIn(user,(err,info)=>{
                var data={
                    'title':'success login',
                    'user':user
                }
                res.json(data)
            })
        // If user credentials are incorrect or invalid, return an error message.
        }else{
            var data={
                'title':'error',
            }
            console.log("Incorrect password")
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

router.get('/product', async (req, res) => {
    var searchTerm = '';
    const vegetables = await Product.findAll({ where: { category: "Vegetable" },include: { model: User} })
    const fruits = await Product.findAll({ where: { category: "Fruits" },include: { model: User}  })
    const cashCrops = await Product.findAll({ where: { category: "Cash crops" } ,include: { model: User} })
    const foodCrops = await Product.findAll({ where: { category: "Food crops" } ,include: { model: User} })
    const dairyProducts = await Product.findAll({ where: { category: "Dairy" } ,include: { model: User} })
    const nonVegProducts = await Product.findAll({ where: { category: "Non-veg" } ,include: { model: User} })
    

    if (req.isAuthenticated()) {
        return res.render('home/product.ejs', { auth: true, user: req.user, vegetables: vegetables, fruits: fruits ,cashCrops: cashCrops, foodCrops: foodCrops, dairyProducts: dairyProducts, nonVegProducts: nonVegProducts, searchTerm: searchTerm  })
    }
    res.render('home/product.ejs', { auth: false, vegetables: vegetables, fruits: fruits,cashCrops: cashCrops, foodCrops: foodCrops, dairyProducts: dairyProducts, nonVegProducts: nonVegProducts ,searchTerm: searchTerm  })
})

router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        console.log(searchTerm)

        const vegetables = await Product.findAll({
            where: {
                category: "Vegetable",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        const fruits = await Product.findAll({
            where: {
                category: "Fruits",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        const cashCrops = await Product.findAll({
            where: {
                category: "Cash crops",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        const foodCrops = await Product.findAll({
            where: {
                category: "Food crops",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        const dairyProducts = await Product.findAll({
            where: {
                category: "Dairy",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        const nonVegProducts = await Product.findAll({
            where: {
                category: "Non-veg",
                productname: {
                    [Op.like]: `%${searchTerm}%`
                }
            },
            include: {
                model: User
            }
        });

        if (req.isAuthenticated()) {
            return res.render('home/product.ejs', {
                auth: true,
                user: req.user,
                vegetables: vegetables,
                fruits: fruits,
                cashCrops: cashCrops,
                foodCrops: foodCrops,
                dairyProducts: dairyProducts,
                nonVegProducts: nonVegProducts,
                searchTerm: searchTerm
            });
        }

        res.render('home/product.ejs', {
            auth: false,
            vegetables: vegetables,
            fruits: fruits,
            cashCrops: cashCrops,
            foodCrops: foodCrops,
            dairyProducts: dairyProducts,
            nonVegProducts: nonVegProducts,
            searchTerm: searchTerm
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching for products.');
    }
});

router.get('/productInfo/:id',async(req, res) => {
    const oneproduct = await Product.findOne({where:{id: req.params.id},include: { model: User}})
    console.log(oneproduct)
    if( req.isAuthenticated()){
        return res.render('home/productInfo.ejs', {auth: true, user: req.user,oneproduct: oneproduct})
    }
    res.render('home/productInfo.ejs', {auth: false,oneproduct: oneproduct})
})

router.post('/productInfo/message',async(req, res) => {
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const UserId=req.body.userid
    console.log(email, subject, message,UserId)
    try {
        // Create a new product instance with the form data and uploaded image path
        const newMessage = await Message.create({
            email,
            subject,
            message,
            UserId
        });
        if(newMessage){
            console.log("Message saved successfully")
            var data={
                'title':'success',
            }
            res.json(data);
        }else{
            console.log("Message wasnot saved")
            var data={
                'title':'failed',
            }
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        var data={
            'title':'failed',
        }
        res.json(data);
    }
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