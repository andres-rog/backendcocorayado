const cloudinary = require('cloudinary').v2;
const Multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDSECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) =>{
        return {
            folder: 'cocorayado',
            allowedFormats: ['png', 'jpg', 'jpeg'],
            fileFilter: function(req, file, cb){
                if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
                    return cb(new Error('Archivo invalido'))
                }
                cb(null, file.originalname)
            },
            public_id: `app-${file.originalname}`
        }
    }
});

const uploadCloud = Multer({storage});

module.exports = uploadCloud