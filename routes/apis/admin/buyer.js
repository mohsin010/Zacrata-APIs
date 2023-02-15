const express = require('express')
const router = express.Router();

const jwtAuth = require('../../../middleware/jwt-auth')
const BuyerController = require('../../../controllers/admin/buyer')

router.get('/', jwtAuth, BuyerController.getBuyers)
router.post('/', jwtAuth, BuyerController.toggleBuyer) 
router.post('/delete', jwtAuth, BuyerController.deleteBuyer)

module.exports = router;