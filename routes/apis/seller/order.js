const express = require('express')
const router = express.Router();
const OrderController = require('../../../controllers/seller/order')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,OrderController.getOrder)
router.get('/getOrders', jwtAuth,OrderController.getOrders)
router.put('/manageOrderStatus', jwtAuth,OrderController.manageOrderStatus)
router.put('/packOrder', jwtAuth,OrderController.packTheOrder)
router.get('/invoice', OrderController.getDoc)
router.get('/invoicelayout', OrderController.getInvoiceData)

module.exports = router;