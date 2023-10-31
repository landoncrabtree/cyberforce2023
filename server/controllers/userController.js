const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const https = require('https');

// exports.create = (req, res) => {

// };

exports.getSQL = catchAsync(async (req, res, next) => {

    // API: https://score.cyberforcecompetition.com/api/v1/ics/current

    const options = {
        hostname: 'score.cyberforcecompetition.com',
        port: 443,
        path: '/api/v1/ics/current',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var data;

    // make request and store response as JSON object
    var response = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let tmp = '';
            res.on('data', d => {
                tmp += d;
            });
            res.on('end', () => {
                resolve(JSON.parse(tmp));
                data = JSON.parse(tmp);
            });
        });
        req.on('error', error => {
            reject(error);
        });
        req.end();
    });

    // get avg battery temp
    const battery_keys = ['battery1_temp', 'battery2_temp', 'battery3_temp', 'battery4_temp'];
    var battery_temp = 0;
    for (var i = 0; i < battery_keys.length; i++) {
        battery_temp += data[battery_keys[i]];
    }
    battery_temp /= battery_keys.length;

    // get total solar irradiance (W/m^2)
    var solar_irradiance = 0;
    const solar_keys = ['s1_irradiance', 's2_irradiance', 's3_irradiance', 's4_irradiance'];
    for (var i = 0; i < solar_keys.length; i++) {
        solar_irradiance += data[solar_keys[i]];
    }

    // calculate grid health
    // 0-50 = Unhealthy
    // 50-80 = Healthy
    // 80-100 = Optimal
    var grid_health = data['grid_health'];

    // calculate total power consumption (W)
    var power_consumption = 0
    const energy_keys = ['res1_draw', 'res2_draw', 'res3_draw', 'res4_draw'];
    for (var i = 0; i < energy_keys.length; i++) {
        power_consumption += data[energy_keys[i]];
    }


    try {
        // const [power] = await db.sequelize.query("'SELECT * FROM power_usage;'",
        //     {
        //       model: Power,
        //       mapToModel: true,
        //     });
        // const [eff] = await db.sequelize.query("'SELECT * FROM efficiencies;'",
        // {
        //     model: Efficiencies,
        //     mapToModel: true,
        // });

        // const [temps] = await db.sequelize.query("'SELECT * FROM temperature;'",
        // {
        //     model: Temperature,
        //     mapToModel: true,
        // });
        // const eff = await db.sequelize.query('SELECT * FROM efficiencies;');
        // const temps = await db.sequelize.query('SELECT * FROM temperature;')

        // console.log(response.rows, '\n');
        res.status(200).json({
        status: 'success',
        data: {
            // data: response.rows,
            // eff: eff.rows,
            // temp: temps.rows
            avg_battery_temp: battery_temp,
            solar_irradiance: solar_irradiance,
            grid_health: grid_health,
            power_consumption: power_consumption
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
