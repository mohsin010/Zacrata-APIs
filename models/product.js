const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    description: {
        type: String,
        required: [true, messages.DESCRIPTION_VALIDATION]
    },
    image: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION]
    },
    price: {
        type: Number,
        default:0.0,
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'unit'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    countries: [
        {
            country:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'country'
            },
            price:{
                type: Number,
                default: 0.0
            }
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});


module.exports = new mongoose.model('product', model);