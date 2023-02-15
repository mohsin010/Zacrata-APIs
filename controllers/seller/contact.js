const ContactService = require('../../services/contact');

const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')


class ContactController {
    async addContact(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.email) throw new apiErrors.ValidationError('email', 'email is Required')
            if (!data.subject) throw new apiErrors.ValidationError('subject', 'subject is Required')
            if (!data.message) throw new apiErrors.ValidationError('message', 'message is Required')
            if (!data.name) throw new apiErrors.ValidationError('name', 'name is Required')


            let contact = await ContactService.addContact(data)

            return res.send(ResponseService.success(contact));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getContacts(req, res) {
        try {

            let contact = await ContactService.getContacts()
            return res.send(ResponseService.success({contact :contact}));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new ContactController()