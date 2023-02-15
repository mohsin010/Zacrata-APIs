const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    name: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    email: {
        type: String,
        default: '',
    },
    country: {
        type: String,
     //   required: [true, messages.DRIVING_LICENSE_IMAGE]
    },
    access_token: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        required: [true, messages.MOBILE_VALIDATION]
    },
    fcm_token:{
        type: String,
        default: ''
    },
    avatar: {
        value: {
            type: String,
            default: ''
        },
        exists: {
            type: Boolean,
            default: true
        }
    },
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = new mongoose.model('buyer', model);