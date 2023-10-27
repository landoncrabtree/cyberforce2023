const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async (options) => {
  //  1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    ignoreTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: options.email,
    to: 'cfc-admin <cfc-admin@cfcmail.local>',
    subject: options.subject,
    text: options.message,
    attachments: {
      filename: options.fileName,
      path: options.filePath,
    },
    // html: --> use for html email
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
