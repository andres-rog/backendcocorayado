
const router = require('express').Router();
const {verifyToken} = require('../config/Auth');
const { addRecipeToFavorites, removeRecipeFromFavorites } = require('../controllers/UserController');

router.post('/addFavoriteRecipe', verifyToken, addRecipeToFavorites);
router.post('/removeFavoriteRecipe', verifyToken, removeRecipeFromFavorites);

module.exports = router;