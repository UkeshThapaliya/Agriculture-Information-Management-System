const express =require('express');
const db=require('./connection')
const {User,Categories,Product} = require('./models/Model')
const passport=require('passport')

require('dotenv').config;

const app = express();

const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session)

const passport_config = require('./passport-config')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use( express.static( "public" ) )
app.use('/uploads', express.static('uploads'))

var options = {
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE
}
var sessionStore = new MySQLStore(options)

app.use(session({
    secret:'flashblog',
    store: sessionStore,
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

const indexRoute = require('./routes/index')
const dashboardRoute = require('./routes/dashboard')

app.use('/',indexRoute);
app.use('/dashboard',dashboardRoute);


app.listen({port:2000},async()=>{
    console.log("The server is running in http://localhost:2000/")
})