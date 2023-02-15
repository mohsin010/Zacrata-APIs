const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    code: {
        type: String,
        required: [true, 'Code Required']
    },
    dialCode: {
        type: String,
        required: [true, 'Dial Code Required']
    },
});

module.exports = new mongoose.model('country', model);