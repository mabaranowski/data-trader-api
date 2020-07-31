const express = require('express');
const router = express.Router();
const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.post('/register', async (req, res) => {
    const dbUser = await User.findOne({email: req.body.email});
    if(!!dbUser) { return res.status(400).send('User already registered'); }

    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth', token).send({ ..._.pick(user, ['email']), token });
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Invalid email or password');
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) { 
        return res.status(400).send('Invalid email or password'); 
    }

    const token = user.generateAuthToken();
    const email = user.email;
    const isSharing = user.isSharing;
    res.send({email, token, isSharing});
});

module.exports = router;