require('dotenv').config();

const Sequelize= require('sequelize')

const db =new Sequelize(process.env.DATABASE,process.env.User,process.env.Pass,{
    HOST:process.env.host,
    dialect:'mysql'
})

db.authenticate().then(() => {
    console.log("Connection established with database")
}).catch((err) => {
    console.log("Error connecting to database")
    console.log(err)
})

module.exports =db