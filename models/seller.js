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
        required: [true, messages.EMAIL_VALIDATION]
    },
    mobile: {
        type: String,
        required: [true, messages.MOBILE_VALIDATION]
    },
    avatar: {
        type: String,
        required: [true, messages.AVATAR_VALIDATION]
    },
    access_token: {
        type: String,
        default: ''
    },
    store_name: {
        type: String,
        required: [true, messages.STORE_NAME]
    },
    store_image: {
        type: String,
        required: [true, messages.STORE_IMAGE]
    },
    store_contact_number: {
        type: String,
        required: [true, messages.STORE_CONTACT_NUMBER]
    },
    store_address: {
        address: {
            type: String,
            required: [true, messages.STORE_ADDRESS]
        },
        geolocation: {
            latitude: {
                type: Number,
                required: [true, messages.LATITUDE]
            },
            longitude: {
                type: Number,
                required: [true, messages.LONGITUDE]
            }
        }
    },
    fcm_token:{
        type: String,
        default: ''
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        price:{
            type:Number,
            default:0.0,
        },
        active: {
            type: Boolean,
            default: true,
        }
    }],
    store_types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store-type',
        required: [true, messages.STORE_TYPE]
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    }],
    country:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country'
    },
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = new mongoose.model('seller', model);