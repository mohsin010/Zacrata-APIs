const express = require('express')
const router = express.Router();
const StoreController = require('../../../controllers/buyer/store')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,StoreController.getStores)
router.get('/detail', jwtAuth,StoreController.getStoreDetail)
router.get('/products', jwtAuth,StoreController.getStoreProducts)
router.get('/getUsedStores', jwtAuth,StoreController.getUsedStores)
router.get('/getproducts', StoreController.getProducts)


module.exports = router;