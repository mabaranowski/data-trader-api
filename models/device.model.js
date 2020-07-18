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

const DEVICE_TYPE = [
    'temperature',
    'humidity',
    'air',
    'light',
    'smartwatch',
    'solar',
    'aircon',
    'vehicle'
];

const DEVICE_LOCATION = [
    'living',
    'bedroom',
    'kitchen',
    'bathroom',
    'dining',
    'garden',
    'hall',
    'garage'
];

exports.Device = Device;
exports.DEVICE_TYPE = DEVICE_TYPE;
exports.DEVICE_LOCATION = DEVICE_LOCATION;