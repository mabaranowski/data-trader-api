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

const createStreams = () => {
    cron.schedule(config.get('cronExpression.createStream'), async () => {
        updateDates();
        DEVICE_TYPE.forEach(async type => {
            DEVICE_LOCATION.forEach(async location => {
                const data = await aggregateData(startPast, endPast, type, location);
                saveStream(data, type, location);
            });
        });
    });
};

const createBundles = () => {
    cron.schedule(config.get('cronExpression.createBundle'), async () => {
        updateDates();
        DEVICE_TYPE.forEach(async type => {
            DEVICE_LOCATION.forEach(async location => {
                const data = await aggregateData(startYesterday, endYesterday, type, location);

                if (data.length !== 0) {
                    saveBundle(data, type, location);
                }
            });
        });
    });
};

const saveBundle = async (data, type, location) => {
    const dataset = new Dataset({
        internalType: DATASET_TYPE.BUNDLE,
        quantity: data.length,
        date: yesterday,
        type: type,
        location: location,
        description: `Bundle for ${shortYesterday} of ${type} data in ${location}`,
        data: data
    });

    await dataset.save();
};

const saveStream = async (data, type, location) => {
    const query = { internalType: 'stream', type: type, location: location };
    const oldData = await Dataset.findOne(query);

    await Dataset.updateOne(query,
        {
            $addToSet: { data: data },
            $setOnInsert: {
                type: type,
                location: location,
                description: `Stream of ${type} data in ${location}`
            }
        },
        {
            upsert: true
        }
    );

    const currentData = await Dataset.findOne(query);
    if (!!oldData && oldData.data.length !== currentData.data.length) {
        await Dataset.updateOne(query, {
            $set: {
                quantity: currentData.data.length,
                lastUpdated: new Date()
            }
        });
    }
};

const aggregateData = (startTime, endTime, type, location) => {
    const result = Data.aggregate([
        {
            $match: {
                'time': {
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
        {
            $match: {
                'device.type': type,
                'device.location': location
            }
        }
    ]);

    return result;
};

module.exports.startBundleJob = createBundles;
module.exports.startStreamJob = createStreams;