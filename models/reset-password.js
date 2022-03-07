const {Schema, model} = require('mongoose');


const ResetPassword = new Schema({
    email: {type: String, unique: true, required: true},
    resetLink: {type: String}
}, {timestamps: true});

module.exports = model('ResetPassword', ResetPassword);