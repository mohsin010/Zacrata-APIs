const express = require('express')
const router = express.Router()
const UserController = require('../../../controllers/seller/user')
const path = require('path').resolve;
const multer = require(path('common/multer'))


const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/',jwtAuth,UserController.getProfile)
router.put('/token',jwtAuth,UserController.registerToken)

module.exports = router;