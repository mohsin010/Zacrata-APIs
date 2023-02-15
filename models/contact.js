
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const model = new Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    subject: {
        type: String
    },
    message:{
        type: String
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('contact', model);