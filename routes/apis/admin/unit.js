const express = require('express')
const router = express.Router();

const jwtAuth = require('./../../../middleware/jwt-auth')
const UnitController = require('../../../controllers/admin/unit')

router.get('/',jwtAuth,UnitController.getUnits)
router.post('/',jwtAuth,UnitController.addUnit)

module.exports = router;