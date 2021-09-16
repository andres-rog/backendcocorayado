const router = require('express').Router();
const {verifyToken} = require('../config/Auth');
const { createRecipe, findRecipes, findRecipe, editRecipe, deleteRecipe } = require('../controllers/RecipeController');
const uploadCloud = require('../config/Cloudinary');
const { upload } = require('../controllers/CloudinaryController');

router.post('/create', verifyToken, createRecipe);
router.post('/findRecipes', verifyToken, findRecipes);
router.post('/findRecipe', verifyToken, findRecipe);
router.post('/editRecipe', verifyToken, editRecipe);
router.post('/deleteRecipe', verifyToken, deleteRecipe);
router.post('/upload', verifyToken, uploadCloud.array('imagenesReceta', 16),upload)

module.exports = router