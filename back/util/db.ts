import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

const sequelize = new Sequelize(DATABASE_URL, {
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected');
  } catch (err) {
    console.log('connecting database failed');
    console.log(err);
    process.exit(1);
  }
};

export { connectToDatabase, sequelize };
