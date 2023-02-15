const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    icon: {
        type: String,
        required: [true, messages.ICON_VALIDATION]
    },
    active:{
        type:Boolean,
        default:true,
    },
    countries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'country'
        }
    ],
}, {
    timestamps: true
});


module.exports = new mongoose.model('category', model);