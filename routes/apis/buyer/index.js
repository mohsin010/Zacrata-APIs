const express = require('express');
const router = express.Router();

 const AuthRoutes = require('./auth')
 const StoreRoutes = require('./store')
 const CartRoutes = require('./cart')
 const OrderRoutes = require('./order')
 const UserRoutes = require('./user')


 router.use('/auth',AuthRoutes)
 router.use('/store',StoreRoutes)
 router.use('/cart',CartRoutes)
 router.use('/order',OrderRoutes)
 router.use('/user',UserRoutes)

module.exports = router; 