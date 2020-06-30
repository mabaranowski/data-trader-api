const config = require('config');
const mongoose = require('mongoose');
const {User} = require('./models/user');
const dashboard = require('./router/dashboard');
const auth = require('./router/auth');
const settings = require('./router/settings');
const metrics = require('./router/metrics');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/dashboard', dashboard);
app.use('/api/auth', auth);
app.use('/api/settings', settings);
app.use('/api/metrics', metrics);

mongoose.connect('mongodb://localhost/data-trader-db', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log(`Connected to database..`))
.catch(err => console.log(`Could not connect to database..`, err));

async function findUser() {
    const users = await User.find();
    console.log(users);
}

app.listen(config.get('port'), () => console.log(`Listening on port ${config.get('port')}..`));