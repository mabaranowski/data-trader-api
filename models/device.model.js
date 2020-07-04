const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    address: String,
    port: Number,
    type: String,
    location: String
});

const Device = mongoose.model('Device', deviceSchema);

exports.Device = Device;