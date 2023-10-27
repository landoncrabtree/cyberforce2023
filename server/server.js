// const mongoose = require('mongoose');
const dotenv = require('dotenv');
path = require('path');

dotenv.config({ path: path.join(__dirname, 'config.env') });

// const DB = process.env.DATABASE;
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log('DB connection successfull'));

const app = require('./app');

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('App is running on port ' + port);
});

const db = require('./models');
db.sequelize.sync();