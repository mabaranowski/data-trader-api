const config = require('config');
const mongoose = require('mongoose');
const dashboard = require('./router/dashboard');
const auth = require('./router/auth');
const settings = require('./router/settings');
const metrics = require('./router/metrics');
const device = require('./router/device');
const data = require('./router/data');
const dataset = require('./router/dataset');
const scheduler = require('./services/scheduler');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/dashboard', dashboard);
app.use('/api/auth', auth);
app.use('/api/settings', settings);
app.use('/api/metrics', metrics);
app.use('/api/device', device);
app.use('/api/data', data);
app.use('/api/dataset', dataset);

mongoose.connect('mongodb://localhost/data-trader-db', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log(`Connected to database..`))
.catch(err => console.log(`Could not connect to database..`, err));

scheduler.bundleTypeScheduler();
scheduler.bundleLocationScheduler();
scheduler.streamTypeScheduler();
scheduler.streamLocationScheduler();

app.listen(config.get('port'), () => console.log(`Listening on port ${config.get('port')}..`));