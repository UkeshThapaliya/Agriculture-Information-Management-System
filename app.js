const express =require('express');
const db=require('./connection')
const {User} = require('./models/Model')

require('dotenv').config;

const app = express();

const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use( express.static( "public" ) )
app.use('/uploads', express.static('uploads'))

const indexRoute = require('./routes/index')
const dashboardRoute = require('./routes/dashboard')

app.use('/',indexRoute);
app.use('/dashboard',dashboardRoute);

app.listen({port:2000},async()=>{
    console.log("The server is running in http://localhost:2000/")
})