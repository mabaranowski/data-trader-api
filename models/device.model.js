const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    address: String,
    response: String,
    tag: String,
    type: String,
    location: String,
    longitude: Number,
    latitude: Number
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
    'poznan',
    'wroclaw',
    'gdansk',
    'krakow',
    'lodz',
    'szczecin',
    'warszawa',
    'lublin'
];

exports.Device = Device;
exports.DEVICE_TYPE = DEVICE_TYPE;
exports.DEVICE_LOCATION = DEVICE_LOCATION;