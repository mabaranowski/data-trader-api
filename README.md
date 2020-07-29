# data-trader-api

## Description
This project is a server-side of **Data Trader**.
The purpose is to provide the functionality of the user, device, data, and dataset management.
It is build as a **Node.js** & **Express** REST API, and uses **MongoDB** as a database.

It is a part of **Data Trader** project:
- For a **client-side**, go to [data-trader-web](https://github.com/mabaranowski/data-trader-web.git)
- For a **sensor-mock**, go to [data-trader-sensor](https://github.com/mabaranowski/data-trader-sensor.git)

## Scheduler
Its purpose is to aggregate data into datasets.
The bundle cron job runs every night at 3 AM. It aggregates all the given data based on location/type criteria from the previous day.
The stream cron job runs every 10 minutes. It aggregates the data and updates the dataset per location/type to ensure the dataset is fresh throughout the day.

## Config
Use [config](config/) to set database url, port, cron expressions etc.

## Requirements
- Node.js 13.12.0+
- npm 6.14.4+

## Install
```
$ npm install
```
## Run
```
$ node index.js
```
