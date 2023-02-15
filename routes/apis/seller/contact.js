const express = require('express')
const router = express.Router();
const ContactController = require('../../../controllers/seller/contact');


router.post('/contact', ContactController.addContact);


module.exports = router     

