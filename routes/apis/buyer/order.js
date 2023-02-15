const express = require('express')
const router = express.Router();
const OrderController = require('../../../controllers/buyer/order')
const jwtAuth = require('./../../../middleware/jwt-auth')

router.get('/', jwtAuth,OrderController.getOrder)
router.get('/getAllOrders', jwtAuth,OrderController.getOrders)
router.post('/', jwtAuth,OrderController.placeOrder)
router.put('/cancelOrder', jwtAuth,OrderController.cancelOrderorder)


module.exports = router;