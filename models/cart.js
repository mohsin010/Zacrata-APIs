const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyer'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    items: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity:{
                type: Number,
                default: 1
            },
            price:{
                type: Number,
                default: 1.0
            },
        }
    ],
    order_total: {
        type: Number,
        default: 0.0
    },
});

module.exports = new mongoose.model('cart', model);