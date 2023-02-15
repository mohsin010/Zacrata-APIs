const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const CategoryController = require('../../../controllers/admin/category')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,CategoryController.getCategories) 
router.get('/:id', jwtAuth,CategoryController.getCategory)
router.post('/', jwtAuth,multer.single('icon'), CategoryController.addCategory)
router.put('/', jwtAuth,multer.single('icon'), CategoryController.updateCategory)
router.post('/delete', jwtAuth , CategoryController.deleteCategory)
router.post('/toggle', jwtAuth , CategoryController.toggleCategory)



module.exports = router;