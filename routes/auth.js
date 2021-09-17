const router = require('express').Router();
const {verifyToken} = require('../config/Auth');
const { signUp, login, loggedUser, logout, verifyUser, changePassword } = require('../controllers/AuthControlller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verifyUser', verifyUser);
router.get('/loggedUser', verifyToken, loggedUser);
router.post('/edit', login);
router.get('/logout', logout);
router.patch('/changePassword', verifyToken, changePassword);

module.exports = router