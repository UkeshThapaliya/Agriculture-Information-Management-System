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
    address:{
        type:DataTypes.STRING(30),
        defaultValue:"Nepal"
    },
    profileImg:{
        type:DataTypes.TEXT()
    }
})

const Categories = db.define('Categories', {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    }
});

const Product = db.define('Product', {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    productname:{
        type: DataTypes.STRING(25),
        allowNull: false
    },
    category:{
        type: DataTypes.STRING(25),

    },
    price:{
        type: DataTypes.STRING(25),
        allowNull: false
    },quality:{
        type: DataTypes.STRING(25),

    },size:{
        type: DataTypes.STRING(25),
        allowNull: false
    },grown:{
        type: DataTypes.STRING(25),
        
    },vitamins:{
        type: DataTypes.STRING(25),
        
    },calories:{
        type: DataTypes.STRING(25),
        
    },soil:{
        type: DataTypes.STRING(25),
        
    },origin:{
        type: DataTypes.STRING(25),
        
    },availability:{
        type: DataTypes.STRING(25),

    },shelflife:{
        type: DataTypes.STRING(25),

    },description:{
        type: DataTypes.TEXT()
    },
    productImg:{
        type:DataTypes.TEXT()
    },
})

const Message = db.define('message', {
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT(),
        allowNull: false
    }
})

// db.sync({alter:true})

Product.belongsTo(User); // Add foreign key constraint
Message.belongsTo(User); 

module.exports = {User,Categories,Product,Message}    