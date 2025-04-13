const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ielts_prep_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      // For reading/writing emoji and other special characters
      charset: 'utf8mb4',
    },
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models with database (only in development)
    if (process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true') {
      console.log('Syncing database models...');
      await sequelize.sync({ alter: true });
      console.log('Database models synced successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
