const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const ProductController = require('../../../controllers/admin/products')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/',jwtAuth,ProductController.getProducts)
router.get('/:id',jwtAuth, ProductController.getProduct)
router.post('/',jwtAuth,  multer.single('image'),ProductController.addProduct)
router.put('/', jwtAuth, multer.single('image'),ProductController.updateProduct)
router.post('/delete', jwtAuth, ProductController.deleteProduct)
router.post('/toggle', jwtAuth, ProductController.toggleProduct)


module.exports = router;