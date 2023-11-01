const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const db = require('../models');
const UserData = db.userData;
const sendEmail = require('../utils/email');
const ftp = require('basic-ftp');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook("https://discord.com/api/webhooks/1166880001715605516/qiwPAAijqm4gdqoQ-yXt3hkie5dW-NJlRw04NT9jIiM4WS-iRmh4gw3fYytYuAc4Z0VY");

exports.userData = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const { fullname, email, phonenumber, message } = req.body;
  const newContact = await UserData.create({
    name: fullname,
    email,
    phoneNumber: phonenumber,
    message,
  });
  var phone = "phone = (" + req.body.phonenumber + ")";
  res.status(200).json({
    status: 'success',
    message: 'User data recieved successfully ' + phone,
    newContact,
  });
});

exports.fileUpload = catchAsync(async (req, res, next) => {

  const newContact = JSON.parse(req.body.newContact);

  if (!req.file) {

    // send webhook
    const embed = new MessageBuilder()
      .setTitle('New Contact Form Submission')
      .addField('Name', newContact.name)
      .addField('Email', newContact.email)
      .addField('Phone Number', newContact.phoneNumber)
      .addField('Message', newContact.message)
      .addField('File Link', 'N/A')
      .setTimestamp();
    hook.send(embed);

    // send email
    sendEmail({
      email: newContact.email,
      subject: 'Contact Form Submission',
      message: `
      Contact Information:\n
      Name: ${newContact.name}

      Email: ${newContact.email}

      Phone Number: ${newContact.phoneNumber}

      Message: ${newContact.message}\n`,
    });

    // skip name update

    // skip ftp upload

    return res.status(200).json({
      status: 'success',
      message:
        'Thank you for contacting us! We have received your message and will get back to you shortly.',
    });
  }

  const file = req.file;
  const fileName = req.file.originalname;
  const uploadDir = path.join(__dirname, '..', 'uploads');
  const filePath = path.join(uploadDir, fileName);

  // update file name in SQL
  const result = await UserData.update(
    { file: fileName },
    { where: { 
      email: newContact.email,
      phoneNumber: newContact.phoneNumber,
      message: newContact.message,
      name: newContact.name
    } }
  );

  // check file size (max 50mb)
  if (file.size > 50000000) {
    return res.status(400).json({
      status: 'error',
      message: 'File size too large. Max file size is 50mb.',
    });
  }

  // send webhook
  const embed = new MessageBuilder()
    .setTitle('New Contact Form Submission')
    .addField('Name', newContact.name)
    .addField('Email', newContact.email)
    .addField('Phone Number', newContact.phoneNumber)
    .addField('Message', newContact.message)
    .addField('File Link', !file ? 'N/A' : file.originalname)
    .setTimestamp();
  hook.send(embed);

  // upload file locally
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save the file.',
      });
    }
  });


  sendEmail({
    email: newContact.email,
    subject: 'Contact Form Submission',
    fileName,
    filePath,
    message: `
    Contact Information:\n
    Name: ${newContact.name}

    Email: ${newContact.email}

    Phone Number: ${newContact.phoneNumber}

    Message: ${newContact.message}\n`,
  });

  // upload file to ftp
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    await client.uploadFrom(filePath, fileName);
  } catch (err) {
    console.log('ftp error\n', err);
  }
  client.close();

  res.status(200).json({
    status: 'success',
    // result,
    message:
      'Thank you for contacting us! We have received your message and will get back to you shortly.',
  });
});

exports.getFiles = catchAsync(async (req, res, next) =>{
  try {
    const filename = path.join(__dirname, '..', '..', 'uploads', '/', req.body.filename);
    const fileStream = fs.createReadStream(filename);
    fileStream.on('error', (error) => {
      console.error('Error reading file:', error);
      res.status(404).send('File not found');
    });
    fileStream.pipe(res);
  } catch (err) {
    console.error('Error handling file request:', error);
    res.status(500).send('Internal Server Error');
  }
});

exports.ftpUpload = catchAsync(async (req, res, next) => {
  const file = req.file;
  const fileName = req.file.originalname;
  const uploadDir = path.join(__dirname, '..', 'uploads');
  console.log(uploadDir);
  const filePath = path.join(uploadDir, fileName);

  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      // Handle error if the file couldn't be saved
      console.error('Error saving file:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save the file.',
      });
    }
  });

  console.log('this is the file\n', file);
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    await client.uploadFrom(filePath, fileName);
  } catch (err) {
    console.log('ftp error\n', err);
  }
  client.close();

  res.status(200).json({
    status: 'success',
    message:
      'Thank you for contacting us! We have received your message and will get back to you shortly.',
  });
});
