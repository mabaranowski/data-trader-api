const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', auth, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const result = await User.updateOne({email: req.body.email}, {
        $set: {
            password: newPassword
        }
    });
    res.send(result);
});

module.exports = router;