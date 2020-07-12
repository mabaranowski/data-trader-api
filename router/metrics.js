const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {User} = require('../models/user');

router.patch('/', auth, async (req, res) => {
    const result = await User.updateOne({email: req.body.email}, {
        $set: {
            metrics: {
                ...req.body.form
            }
        }
    });
    res.send(result);
});

router.patch('/share-flag', auth, async (req, res) => {
    const result = await User.updateOne({email: req.body.email}, {
        $set: {
            isSharing: req.body.isSharing
        }
    });
    res.send(result);
});

router.post('/share-flag', auth, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    res.send(user.isSharing);
});

router.post('/', auth, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    res.send(user.metrics);
});

module.exports = router;