const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testAttemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TestAttempts',
      key: 'id'
    }
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Questions',
      key: 'id'
    }
  },
  answerText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  selectedOptions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of selected options for MCQs'
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'For objective questions'
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Score for this answer'
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Feedback for this specific answer'
  },
  audioRecording: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to audio recording for speaking answers'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time spent on this question in seconds'
  }
}, {
  timestamps: true
});

module.exports = Answer;
