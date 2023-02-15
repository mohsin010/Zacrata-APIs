const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    order_id: {
        type: String,
        required: [true, messages.ORDER_ID_VALIDATION]
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyer'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                default: 1.0
            },
            isPacked: {
                type: Boolean,
                default:false
            },
        }
    ],
    order_total: {
        type: Number,
        default: 0.0
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4],
        default:1
    },
    isPacked: {
        type: Boolean,
        default:false
    },
    isArrived: {
        type: Boolean,
        default: false
    },
    start_time: {
        type: Date,
        default: Date.now(),
    },
    end_time: {
        type: Date,
        default: Date.now(),
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('order', model);