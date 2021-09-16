const router = require('express').Router();

const uploadCloud = require('../config/Cloudinary');
const { upload } = require('../controllers/CloudinaryController');

router.post('/upload', uploadCloud.array('img'),upload)

module.exports = router;
