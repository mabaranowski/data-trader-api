const cron = require('node-cron');
const moment = require('moment');
const config = require('config');
const { Data } = require('../models/data.model');
const { Dataset, DATASET_TYPE } = require('../models/dataset.model');
const { DEVICE_TYPE, DEVICE_LOCATION } = require('../models/device.model');

let yesterday, startYesterday, endYesterday, shortYesterday, startPast, endPast;

const updateDates = () => {
    yesterday = moment().subtract(1, 'day').utcOffset(0).startOf('day');
    startYesterday = yesterday.toDate().toISOString();
    endYesterday = moment(yesterday).endOf('day').toDate().toISOString();
    shortYesterday = yesterday.format('DD.MM.YYYY');

    startPast = moment().subtract(10, 'minutes').local().toISOString();
    endPast = moment().toISOString();
};

const createStreamByType = () => {
    cron.schedule(config.get('cronExpression.streamByType'), async () => {
        updateDates();
        DEVICE_TYPE.forEach(async type => {
            const data = await aggregateDataByTimeAndField(startPast, endPast, 'type', type);
            updateDatasetStream(data, 'type', type);
        });
    });
};

const createStreamByLocation = () => {
    cron.schedule(config.get('cronExpression.streamByLocation'), async () => {
        updateDates();
        DEVICE_LOCATION.forEach(async location => {
            const data = await aggregateDataByTimeAndField(startPast, endPast, 'location', location);
            updateDatasetStream(data, 'location', location);
        });
    });
};

const createBundleByType = () => {
    cron.schedule(config.get('cronExpression.bundleByType'), async () => {
        updateDates();
        DEVICE_TYPE.forEach(async type => {
            const data = await aggregateDataByTimeAndField(startYesterday, endYesterday, 'type', type);

            if (data.length !== 0) {
                const dataset = createDataset(data, type, true);
                await dataset.save();
            }
        });
    });
};

const createBundleByLocation = () => {
    cron.schedule(config.get('cronExpression.bundleByLocation'), async () => {
        updateDates();
        DEVICE_LOCATION.forEach(async location => {
            const data = await aggregateDataByTimeAndField(startYesterday, endYesterday, 'location', location);

            if (data.length !== 0) {
                const dataset = createDataset(data, location, false);
                await dataset.save();
            }
        });
    });
};

const createDataset = (data, variable, isType) => {
    const dataset = new Dataset({
        internalType: DATASET_TYPE.BUNDLE,
        quantity: data.length,
        date: yesterday,
        data: data
    });
    
    if (isType) {
        dataset.type = variable;
        dataset.description = `Bundle for ${shortYesterday} of ${variable}`;
    } else {
        dataset.location = variable;
        dataset.description = `Bundle for ${shortYesterday} at ${variable}`;
    }

    return dataset;
};

const updateDatasetStream = async (data, field, variable) => {
    const query = { [field]: variable, internalType: 'stream' };
    const oldData = await Dataset.findOne(query);

    await Dataset.updateOne(query,
        {
            $addToSet: { data: data },
            $setOnInsert: { description: `Stream of ${variable} data` }
        },
        {
            upsert: true
        }
    );
    
    const currentData = await Dataset.findOne(query);
    if(!!oldData && oldData.data.length !== currentData.data.length) {
        await Dataset.updateOne(query, {
            $set: { 
                quantity: currentData.data.length,
                lastUpdated: new Date()
            }
        });
    }
};

const aggregateDataByTimeAndField = (startTime, endTime, field, variable) => {
    const result = Data.aggregate([
        {
            $match: {
                'payload.time': {
                    $gte: startTime,
                    $lte: endTime
                }
            }
        },
        {
            $lookup:
            {
                from: 'devices',
                localField: 'device',
                foreignField: '_id',
                as: 'device'
            }
        },
        { $unwind: '$device' },
        { $match: { [`device.${field}`]: variable } }
    ]);

    return result;
};

module.exports.bundleTypeScheduler = createBundleByType;
module.exports.bundleLocationScheduler = createBundleByLocation;
module.exports.streamTypeScheduler = createStreamByType;
module.exports.streamLocationScheduler = createStreamByLocation;