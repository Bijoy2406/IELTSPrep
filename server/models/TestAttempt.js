const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TestAttempt = sequelize.define('TestAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tests',
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalScore: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  bandScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'IELTS band score (0-9)'
  },
  status: {
    type: DataTypes.ENUM('in-progress', 'completed', 'submitted', 'reviewed'),
    defaultValue: 'in-progress'
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin feedback on writing/speaking tests'
  },
  feedbackBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Admin who provided feedback'
  },
  feedbackDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = TestAttempt;
