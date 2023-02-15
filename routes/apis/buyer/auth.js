const express = require('express')
const router = express.Router()
const AuthController = require('../../../controllers/common/auth')
const path = require('path').resolve;
const multer = require(path('common/multer'))
router.post('/register',multer.none() ,AuthController.buyerRegistration.bind(AuthController))
router.post('/login', AuthController.buyerLogin.bind(AuthController))

module.exports = router;