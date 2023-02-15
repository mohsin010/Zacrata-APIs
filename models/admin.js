const messages = require('../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    name: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    email: {
        type: String,
        required: [true, messages.EMAIL_VALIDATION]
    },
    mobile: {
        type: String,
        required: [true, messages.MOBILE_VALIDATION]
    },
    access_token: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: [true, messages.PASSWORD_VALIDATION]
    },
    avatar: {
        value:{
            type: String,
            default: '',
        },
        exists:{
            type: Boolean,
            default: false,
        }
    },
    active:{
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('admin', model);