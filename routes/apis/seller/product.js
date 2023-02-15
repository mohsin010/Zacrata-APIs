const express = require('express')
const router = express.Router();
const ProductController = require('../../../controllers/seller/product')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,ProductController.getProducts)
router.get('/grouped', jwtAuth,ProductController.getAggregatedProducts)
router.put('/price', jwtAuth,ProductController.updatePrice)
router.put('/toggle', jwtAuth,ProductController.toggleProductStatus)
 

module.exports = router;