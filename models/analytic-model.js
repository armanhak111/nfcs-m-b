const { ObjectId } = require('mongodb');
const {Schema, model} = require('mongoose');


const AnalyticSchema = new Schema({
    id: {type: ObjectId, required: true, unique: true},
    analytics: [Object]
});

module.exports = model('Analytic', AnalyticSchema);