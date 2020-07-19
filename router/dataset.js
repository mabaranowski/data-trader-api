const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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
    const dataset = await Dataset.find({ _id: req.params.id });
    res.send(dataset);
});

module.exports = router;