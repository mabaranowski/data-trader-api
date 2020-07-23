const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/user.model');

router.patch('/', auth, async (req, res) => {
    const result = await User.updateOne({ email: req.body.email }, {
        $addToSet: {
            datasets: req.body.dataset
        }
    });
    res.send(result);
});

router.delete('/', auth, async (req, res) => {
    const result = await User.updateOne({ email: req.query.email }, {
        $pull: {
            datasets: req.query.dataset
        }
    });
    res.send(result);
});

router.get('/', auth, async (req, res) => {
    const result = await User.aggregate([
        { $match: { email: req.query.email } },
        {
            $lookup: {
                'from': 'datasets',
                'localField': 'datasets',
                'foreignField': '_id',
                'as': 'dataset'
            }
        },
        { $unwind: '$dataset' },
        { $project: { dataset: 1 } },
        { $project: { 'dataset.data': 0, _id: 0 } }
    ]);
    res.send(result);
});

module.exports = router;