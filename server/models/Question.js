const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tests',
      key: 'id'
    }
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  questionType: {
    type: DataTypes.ENUM(
      'multiple-choice',
      'true-false',
      'matching',
      'fill-blank',
      'essay',
      'short-answer',
      'speaking-prompt'
    ),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON array of options for MCQs, matching, etc.'
  },
  correctAnswer: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'For objective questions. For subjective, it will be null.'
  },
  marks: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1.0
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Section or passage this question belongs to'
  },
  audioFile: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to audio file for listening questions'
  },
  imageFile: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to image file if question has an image'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Order of question in the test'
  }
}, {
  timestamps: true
});

module.exports = Question;
