const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datasetSchema = new mongoose.Schema({
    internalType: String,
    type: String,
    location: String,
    quantity: Number,
    date: Date,
    lastUpdated: Date,
    description: String,
    data: [{ type: Schema.Types.ObjectId, ref: 'Data' }]
});

const Dataset = mongoose.model('Dataset', datasetSchema);

const DATASET_TYPE = {
    BUNDLE: 'bundle',
    STREAM: 'stream'
}

exports.Dataset = Dataset;
exports.DATASET_TYPE = DATASET_TYPE;