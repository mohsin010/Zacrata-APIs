const express = require('express')
const router = express.Router();

const jwtAuth = require('./../../../middleware/jwt-auth')
const CountryController = require('../../../controllers/admin/country')

router.get('/', jwtAuth, CountryController.getCountries)
router.post('/', jwtAuth, CountryController.addCountry)
router.get('/category', jwtAuth, CountryController.getCountriesByCategory)

module.exports = router;