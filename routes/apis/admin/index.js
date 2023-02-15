const express = require('express');
const router = express.Router();

const AuthRoutes = require('./auth')
const CategoryRoutes = require('./category')
const ProductRoutes = require('./product')
const UnitRoutes = require('./unit')
const StoreTypeRoutes = require('./store-type')
const SellerRoutes = require('./seller')
const CountryRoutes = require('./country')
const BuyerRoutes = require('./buyer')


router.use('/auth',AuthRoutes)
router.use('/category',CategoryRoutes)
router.use('/product',ProductRoutes)
router.use('/unit',UnitRoutes)
router.use('/storeType',StoreTypeRoutes)
router.use('/seller',SellerRoutes)
router.use('/country',CountryRoutes)
router.use('/buyer',BuyerRoutes)


module.exports = router; 