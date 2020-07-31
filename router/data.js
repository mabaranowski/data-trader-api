const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Data } = require('../models/data.model');

router.post('/', auth, async (req, res) => {
    const data = new Data({
        device: req.body.id,
        payload: req.body.payload
    });

    const result = await data.save();
    res.send(result);
});

router.get('/', auth, async (req, res) => {
    const data = await Data.find({device: req.query.device})
    res.send(data);
});

module.exports = router;