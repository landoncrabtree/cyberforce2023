// const mongoose = require('mongoose');
const validator = require('validator');
const { sequelize } = require('.');

module.exports = (sequelize, Sequelize) => {
  const UserData = sequelize.define('userData', {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    },
    file: {
      type: Sequelize.STRING
    },
  });

  return UserData;
}

// It looks like we moved to sql not mongoose


// const userDataSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please tell us your name'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide your email'],
//     lowercase: true,
//     validate: [validator.isEmail, 'Please enter a valid email'],
//   },
//   phoneNumber: {
//     type: String,
//   },
//   message: {
//     type: String,
//   },
//   file: {
//     type: String,
//   },
// });
