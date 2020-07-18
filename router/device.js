const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {User} = require('../models/user.model');
const {Device} = require('../models/device.model');

router.post('/', auth, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    
    const device = new Device({
        user: user._id,
        name: req.body.form.deviceName,
        address: req.body.form.deviceAddress,
        port: req.body.form.devicePort,
        type: req.body.form.deviceType,
        location: req.body.form.deviceLocation
    });
    
    const result = await device.save();

    res.send(result);
});

router.get('/', auth, async (req, res) => {
    const devices = await Device.aggregate([
        {
            $lookup: {
                'from': 'users',
                'localField': 'user',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        { 
            $match: { 
                'user.email': req.query.email 
            } 
        },
        {
            $project: {
                name: 1,
                address: 1,
                port: 1
            }
        }
    ]);

    res.send(devices);
});

router.get('/:id', auth, async (req, res) => {
    const device = await Device.findById(req.params.id);
    res.send(device);
});

router.delete('/', auth, async (req, res) => {
    const device = await Device.deleteOne({ _id: req.query.id });
    res.send(device);
});

module.exports = router;
