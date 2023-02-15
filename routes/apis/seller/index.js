const express = require('express');
const router = express.Router();

const AuthRoutes = require('./auth')
const OrderRoutes = require('./order')
const UserRoutes = require('./user')
const ProductRoutes = require('./product')
const ContactRoutes = require('./contact')

router.use('/auth',AuthRoutes)
router.use('/order',OrderRoutes)
router.use('/user',UserRoutes)
router.use('/product',ProductRoutes)
router.use('/contact', ContactRoutes)


module.exports = router; 