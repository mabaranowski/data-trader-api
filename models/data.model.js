const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new mongoose.Schema({
    device: { type: Schema.Types.ObjectId, ref: 'Device' }
}, { strict: false });

const Data = mongoose.model('Data', dataSchema);

exports.Data = Data;