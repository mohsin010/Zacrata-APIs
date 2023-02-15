const express = require('express')
const router = express.Router()

const adminRoutes = require('./admin')
const buyerRoutes = require('./buyer')
const sellerRoutes = require('./seller')

router.use('/admin',adminRoutes)
router.use('/seller',sellerRoutes)
router.use('/buyer',buyerRoutes)


module.exports = router;