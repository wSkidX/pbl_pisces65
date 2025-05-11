require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Auth service running on port 3001');
  });
});
