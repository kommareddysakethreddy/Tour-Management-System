'use strict';
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const Tour = require('../models/tourSchema');

const app = express();

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_LOCAL);

mongoose.connection.on('connected', () =>
    console.log('connected to database successfully')
);
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tourData.json`, 'utf-8')
);
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//     fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );
console.log('read');
// console.log(process.argv)
const importData = async() => {
    try {
        await Tour.create(tours);
        // await User.create(users, { validateBeforeSave: false });
        // await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async() => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}