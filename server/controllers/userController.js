const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');

// exports.create = (req, res) => {

// };

exports.getSQL = catchAsync(async (req, res, next) => {
    try {
        const [power] = await db.sequelize.query("'SELECT * FROM power_usage;'",
            {
              model: Power,
              mapToModel: true,
            });
        const [eff] = await db.sequelize.query("'SELECT * FROM efficiencies;'",
        {
            model: Efficiencies,
            mapToModel: true,
        });

        const [temps] = await db.sequelize.query("'SELECT * FROM temperature;'",
        {
            model: Temperature,
            mapToModel: true,
        });
        // const eff = await db.sequelize.query('SELECT * FROM efficiencies;');
        // const temps = await db.sequelize.query('SELECT * FROM temperature;')

        console.log(response.rows, '\n');
        res.status(200).json({
        status: 'success',
        data: {
            data: response.rows,
            eff: eff.rows,
            temp: temps.rows

        },
        message: 'database connection successfully established',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
        status: 'error',
        message: 'failed to connect',
        });
}
});

// exports.findAll = (req, res) => {

// };

// exports.findOne = (req, res) => {

// };

// exports.update = (req, res) => {

// };

// exports.delete = (req, res) => {

// };

// exports.deleteAll = (req, res) => {

// };
