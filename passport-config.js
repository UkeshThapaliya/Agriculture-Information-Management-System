const LocalStrategy=require('passport-local').Strategy;
const Sequelize = require('sequelize');
const passport = require('passport')
const {User}= require('./models/Model.js')
const bycrypt=require('bcrypt')

passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
    User.findOne({where: {email: email}}).then((user)=>{
        if(!user){
            // console.log(user)
            return done(null,false,{message:'no info'}) 
        }
        bycrypt.compare(password,user.password,function(err,res){
            if (res){
                console.log("Login sucessful")
                return done(null,user, )
            } else{
                return done(null,false)
            }
        })
    })
}))

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser((id,done)=>{
    const fetchuser=(id)=>User.findByPk(id)
    fetchuser(id).then((user)=>{
        return done(null,user);
    })
})