const User = require('./User');
const Test = require('./Test');
const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const Answer = require('./Answer');
const SpeakingSchedule = require('./SpeakingSchedule');
const SupportTicket = require('./SupportTicket');
const TicketMessage = require('./TicketMessage');

// Define associations

// User associations
User.hasMany(Test, { foreignKey: 'createdBy', as: 'createdTests' });
User.hasMany(TestAttempt, { foreignKey: 'userId', as: 'testAttempts' });
User.hasMany(TestAttempt, { foreignKey: 'feedbackBy', as: 'reviewedAttempts' });
User.hasMany(SpeakingSchedule, { foreignKey: 'userId', as: 'speakingAppointments' });
User.hasMany(SpeakingSchedule, { foreignKey: 'examinerUserId', as: 'examinedAppointments' });
User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'supportTickets' });
User.hasMany(SupportTicket, { foreignKey: 'assignedTo', as: 'assignedTickets' });
User.hasMany(TicketMessage, { foreignKey: 'userId', as: 'ticketMessages' });

// Test associations
Test.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Test.hasMany(Question, { foreignKey: 'testId', as: 'questions' });
Test.hasMany(TestAttempt, { foreignKey: 'testId', as: 'attempts' });
Test.hasMany(SpeakingSchedule, { foreignKey: 'testId', as: 'speakingSchedules' });

// Question associations
Question.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });

// TestAttempt associations
TestAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
TestAttempt.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
TestAttempt.belongsTo(User, { foreignKey: 'feedbackBy', as: 'reviewer' });
TestAttempt.hasMany(Answer, { foreignKey: 'testAttemptId', as: 'answers' });
TestAttempt.hasOne(SpeakingSchedule, { foreignKey: 'testAttemptId', as: 'speakingSession' });

// Answer associations
Answer.belongsTo(TestAttempt, { foreignKey: 'testAttemptId', as: 'testAttempt' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// SpeakingSchedule associations
SpeakingSchedule.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SpeakingSchedule.belongsTo(User, { foreignKey: 'examinerUserId', as: 'examiner' });
SpeakingSchedule.belongsTo(Test, { foreignKey: 'testId', as: 'test' });
SpeakingSchedule.belongsTo(TestAttempt, { foreignKey: 'testAttemptId', as: 'testAttempt' });

// SupportTicket associations
SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SupportTicket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
SupportTicket.hasMany(TicketMessage, { foreignKey: 'ticketId', as: 'messages' });

// TicketMessage associations
TicketMessage.belongsTo(SupportTicket, { foreignKey: 'ticketId', as: 'ticket' });
TicketMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Test,
  Question,
  TestAttempt,
  Answer,
  SpeakingSchedule,
  SupportTicket,
  TicketMessage
};
