const {Schema, model} = require('mongoose');


const ContactSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    inquiry: {type: String, required: true},
    message: {type: String, required: true},
});

module.exports = model('Contact', ContactSchema);