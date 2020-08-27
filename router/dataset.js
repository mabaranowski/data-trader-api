const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { Dataset } = require('../models/dataset.model');

router.get('/', auth, async (req, res) => {
    const datasets = await Dataset.find({
        internalType: req.query.type,
        quantity: { $gt: 0 }
    },
        {
            data: 0
        });
    res.send(datasets);
});

router.get('/:id', auth, async (req, res) => {
    const dataset = await Dataset.findById(req.params.id);
    res.send(dataset);
});

router.get('/:id/unwrapped', auth, async (req, res) => {
    const dataset = await Dataset.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                'from': 'datas',
                'localField': 'data',
                'foreignField': '_id',
                'as': 'data'
            }
        },
        { $unwind: '$data' },
        { $project: { data: '$data.payload', time: '$data.time', _id: 0 } }
    ]);
    res.send(dataset);
});

router.get('/:id/unwrapped/metadata', auth, async (req, res) => {
    const dataset = await Dataset.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                'from': 'datas',
                'localField': 'data',
                'foreignField': '_id',
                'as': 'data'
            }
        },
        { $unwind: '$data' },
        {
            $lookup: {
                'from': 'devices',
                'localField': 'data.device',
                'foreignField': '_id',
                'as': 'data.device'
            }
        },
        { $unwind: '$data.device' },
        {
            $lookup: {
                'from': 'users',
                'localField': 'data.device.user',
                'foreignField': '_id',
                'as': 'data.device.user'
            }
        },
        { $unwind: '$data.device.user' },
        {
            $project: {
                metrics: '$data.device.user.metrics',
                location: 1, type: 1, description: 1,
                date: 1, lastUpdated: 1, quantity: 1,
                payload: '$data.payload', device: '$data.device'
            }
        },
        {
            $project: {
                'device._id': 0, 'device.__v': 0, 'device.user': 0, _id: 0
            }
        }
    ]);
    res.send(dataset);
});

module.exports = router;