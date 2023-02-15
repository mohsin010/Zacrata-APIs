const express = require('express')
const router = express.Router()
const UserController = require('../../../controllers/buyer/user')
const path = require('path').resolve;
const multer = require(path('common/multer'))


const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/',jwtAuth,UserController.getProfile)
router.put('/', multer.single('driving_license') ,jwtAuth,UserController.updateProfile)
router.put('/token',jwtAuth,UserController.registerToken)

module.exports = router;