
const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const SellerController = require('../../../controllers/admin/seller')
const ContactController = require('../../../controllers/seller/contact');
const jwtAuth = require('./../../../middleware/jwt-auth')



router.get('/products', jwtAuth, SellerController.getProducts)
router.get('/categories', jwtAuth, SellerController.getCategories)
router.get('/', jwtAuth, SellerController.getSellers)
router.get('/:id', jwtAuth, SellerController.getSeller)
router.post('/', jwtAuth, multer.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'store_image', maxCount: 1 }, ,
]), SellerController.addSeller)
router.put('/', jwtAuth, multer.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'store_image', maxCount: 1 }, ,
]), SellerController.updateSeller)
router.post('/products', jwtAuth, SellerController.addProducts)

router.post('/categories', jwtAuth, SellerController.addCategories)

router.put('/products', jwtAuth, SellerController.removeProducts)
router.put('/addStoreType', jwtAuth, SellerController.addStoreTypes)
router.put('/removeStoreType', jwtAuth, SellerController.removeStoreTypes)
router.put('/removeCategories', jwtAuth, SellerController.removeCategory)
router.post('/delete', jwtAuth, SellerController.deleteSeller)
router.post('/toggle', jwtAuth, SellerController.toggleSeller)
router.post('/toggleSellerCategory', jwtAuth, SellerController.toggleSellerCategory)

router.post('/contacts', jwtAuth, ContactController.getContacts)




module.exports = router; 