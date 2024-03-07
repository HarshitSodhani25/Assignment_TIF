const express = require('express');
const {login, signUp, getMyDetail} = require('../controller/Auth');
const {auth} = require('../middleware/Auth');
const router = express.Router();


router.post('/signin', login);
router.post('/signup', signUp);
router.get('/me', auth, getMyDetail)

module.exports = router;