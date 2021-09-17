
const router = require('express').Router();
const {verifyToken} = require('../config/Auth');
const { addRecipeToFavorites, removeRecipeFromFavorites, editUser } = require('../controllers/UserController');

router.post('/addFavoriteRecipe', verifyToken, addRecipeToFavorites);
router.post('/removeFavoriteRecipe', verifyToken, removeRecipeFromFavorites);
router.patch('/editUser', verifyToken, editUser);

module.exports = router;