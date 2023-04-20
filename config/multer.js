const multer  = require('multer')
const path = require('path')

//store destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix +  path.extname(file.originalname))
    }
})

//initilization
const uploadFarmerImg = multer({
    storage: storage,
    limits: { fileSize: 5*1024*1024},
    fileFilter: function(req, file, cb){
        // console.log(file)
        checkFileType(file, cb);
      }
})

const uploadFarmerImages = uploadFarmerImg.fields([{name: 'profile'}])
const uploadProductImages = uploadFarmerImg.fields([{name: 'productImg'}])

//check file type
function checkFileType(file, cb) {
    //allowed type
    const filetypes = /jpeg|jpg|png/
    //check type
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    //check mime
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname) {
        return cb(null,true)
    } else {
        cb('Error: Image Only!')
    }
}

module.exports = {uploadFarmerImages, uploadProductImages}