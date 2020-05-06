const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

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
    res.header('x-auth', token).send(_.pick(user, ['_id', 'email']));
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) { return res.status(400).send('Invalid email or password'); }

    const token = user.generateAuthToken();
    res.send(token);
});

module.exports = router;