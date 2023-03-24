const Sequelize=require('sequelize');
const DataTypes=Sequelize.DataTypes;
const db=require('../connection')

const User= db.define('User',{
    id:{
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4

    },
    name:{
        type:DataTypes.STRING(25),
        allowNull: false,

    },
    email:{
        type:DataTypes.STRING(100),
        allowNull: false,
    },
    phoneNumber:{
        type:DataTypes.STRING(15),
        allowNull: false,
    },
    password:{
        type:DataTypes.STRING(70),
        allowNull: false,
    },
    role:{
        type:DataTypes.STRING(30),
        allowNull: false,
        defaultValue:"farmer"
    },
    profileImg:{
        type:DataTypes.TEXT()
    }
})

// db.sync({alter:true})

module.exports = {User}    