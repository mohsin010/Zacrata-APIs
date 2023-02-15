const messages = require('./../common/messages')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
});

module.exports = new mongoose.model('unit', model);