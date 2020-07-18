const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    metrics: {
        firstName: String,
        lastName: String,
        age: Number,
        genderGroup: String,
        longitude: String,
        latitude: String,
        city: String,
        settingsGroup: String,
        education: String,
        householdIncome: Number,
        residents: Number,
        energy: Number
    },
    isSharing: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

exports.User = User;