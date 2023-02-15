const Contact = require('../models/contact');

class ContactService {
    addContact(details){
        return new Contact(details).save();
    }
    getContacts(){
        return Contact.find();
    }
}

module.exports = new ContactService()