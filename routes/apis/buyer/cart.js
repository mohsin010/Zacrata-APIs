const express = require('express')
const router = express.Router();
const CartController = require('../../../controllers/buyer/cart')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,CartController.getCart)
router.put('/addToCart', jwtAuth,CartController.addToCart)
router.put('/removeFromCart', jwtAuth,CartController.removeFromCart)
router.put('/deleteCart', jwtAuth,CartController.deleteCart)
router.put('/updateCart', jwtAuth,CartController.updateCart)

module.exports = router;