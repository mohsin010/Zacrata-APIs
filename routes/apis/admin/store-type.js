const express = require('express')
const router = express.Router();

const jwtAuth = require('./../../../middleware/jwt-auth')
const StoreTypeController = require('../../../controllers/admin/store-type')

router.get('/',jwtAuth,StoreTypeController.getStoreTypes)
router.post('/',jwtAuth,StoreTypeController.addStoreType)

module.exports = router;