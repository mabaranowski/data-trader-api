const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');

router.patch('/change-password', auth, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const result = await User.updateOne({email: req.body.email}, {
        $set: {
            password: newPassword
        }
    });
    res.send(result);
});

router.post('/check-password', auth, async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    res.send(validPassword); 
});

module.exports = router;