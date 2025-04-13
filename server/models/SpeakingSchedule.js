const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SpeakingSchedule = sequelize.define('SpeakingSchedule', {
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
    allowNull: true,
    references: {
      model: 'Tests',
      key: 'id'
    },
    comment: 'Optional specific test to be used'
  },
  examinerUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Admin who will conduct the speaking test'
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15,
    comment: 'Duration in minutes'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
    defaultValue: 'scheduled'
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Zoom/Google Meet/etc meeting link'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  testAttemptId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'TestAttempts',
      key: 'id'
    },
    comment: 'Created when the test is completed and results are recorded'
  }
}, {
  timestamps: true
});

module.exports = SpeakingSchedule;
