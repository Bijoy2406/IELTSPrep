-- Seed file for IELTS Preparation Platform
-- Use this to populate the database with test data

USE ielts_prep_db;

-- Sample Tests
INSERT INTO Tests (title, description, type, difficultyLevel, duration, instructions, isActive, isPremium, createdBy, createdAt, updatedAt)
VALUES
  ('IELTS Reading Practice Test 1', 'A practice test focusing on academic reading skills.', 'reading', 'medium', 60, 'Read each passage and answer the questions. You have 60 minutes to complete the test.', TRUE, FALSE, 1, NOW(), NOW()),
  ('IELTS Listening Sample Test', 'Practice listening test with 4 sections.', 'listening', 'easy', 30, 'Listen to the recording and answer the questions. The recording will be played only once.', TRUE, FALSE, 1, NOW(), NOW()),
  ('Academic Writing Task 1', 'Data interpretation and visual information description task.', 'writing', 'medium', 20, 'Spend 20 minutes on Task 1. Write at least 150 words.', TRUE, FALSE, 1, NOW(), NOW()),
  ('IELTS Speaking Practice Test', 'Complete speaking test with all three parts.', 'speaking', 'medium', 15, 'This test simulates a real IELTS Speaking test with introduction, individual long turn, and discussion sections.', TRUE, FALSE, 1, NOW(), NOW()),
  ('IELTS Full Practice Test - Academic', 'Complete IELTS Academic test with all four modules.', 'full', 'hard', 170, 'This test contains all four modules: Listening, Reading, Writing, and Speaking. Complete each section within the allocated time.', TRUE, TRUE, 1, NOW(), NOW());

-- Reading Test Questions
INSERT INTO Questions (testId, questionText, questionType, options, correctAnswer, marks, explanation, difficulty, section, `order`, createdAt, updatedAt)
VALUES
  (1, 'According to the passage, what is the main cause of urban traffic congestion?', 'multiple-choice',
   JSON_ARRAY('Increased population', 'Poor city planning', 'Lack of public transportation', 'Rise in car ownership'),
   '[3]', 1.0, 'The passage explicitly states that the lack of adequate public transportation infrastructure is the primary cause of congestion in urban areas.',
   'medium', 'Passage 1', 0, NOW(), NOW()),

  (1, 'The author suggests that the solution to traffic problems is:', 'multiple-choice',
   JSON_ARRAY('Building more roads', 'Implementing congestion charges', 'Improving public transportation', 'Restricting car ownership'),
   '[2, 3]', 1.0, 'The passage recommends both congestion charges and public transportation improvements as complementary solutions.',
   'medium', 'Passage 1', 1, NOW(), NOW()),

  (1, 'True or False: The passage states that bicycle lanes have been successful in all cities where they have been implemented.', 'true-false',
   JSON_ARRAY('True', 'False'),
   '[1]', 1.0, 'The passage mentions that bicycle lanes have had mixed results, with success primarily in cities with favorable weather and terrain.',
   'easy', 'Passage 1', 2, NOW(), NOW());

-- Listening Test Questions
INSERT INTO Questions (testId, questionText, questionType, options, correctAnswer, marks, explanation, difficulty, section, audioFile, `order`, createdAt, updatedAt)
VALUES
  (2, 'What is the main topic of the lecture?', 'multiple-choice',
   JSON_ARRAY('Marine biology', 'Climate change', 'Ocean conservation', 'Fishing practices'),
   '[2]', 1.0, 'The lecture primarily discusses climate change and its impacts.',
   'easy', 'Section 1', '/audio/listening_test1_part1.mp3', 0, NOW(), NOW()),

  (2, 'According to the speaker, which of the following is NOT an effect of global warming?', 'multiple-choice',
   JSON_ARRAY('Rising sea levels', 'Increased hurricane frequency', 'Coral bleaching', 'Decreased rainfall'),
   '[3]', 1.0, 'The speaker mentions rising sea levels, increased hurricane frequency, and decreased rainfall as effects, but does not mention coral bleaching.',
   'medium', 'Section 1', '/audio/listening_test1_part1.mp3', 1, NOW(), NOW()),

  (2, 'Fill in the blank: The speaker predicts that by 2050, global temperatures will rise by ____ degrees Celsius.', 'fill-blank',
   NULL,
   '{"answer": "2.5"}', 1.0, 'The speaker specifically states that global temperatures are predicted to rise by 2.5 degrees Celsius by 2050.',
   'medium', 'Section 1', '/audio/listening_test1_part1.mp3', 2, NOW(), NOW());

-- Writing Test Questions
INSERT INTO Questions (testId, questionText, questionType, marks, difficulty, imageFile, `order`, createdAt, updatedAt)
VALUES
  (3, 'The graph below shows the percentage of households with internet access in three countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.', 'essay',
   9.0, 'medium', '/images/internet_access_graph.png', 0, NOW(), NOW());

-- Speaking Test Questions
INSERT INTO Questions (testId, questionText, questionType, marks, difficulty, `order`, createdAt, updatedAt)
VALUES
  (4, 'Tell me about your hometown. What do you like or dislike about it?', 'speaking-prompt',
   3.0, 'easy', 0, NOW(), NOW()),
  (4, 'Describe a time when you helped someone. You should say: who you helped, what you did, why you helped this person, and how you felt about helping.', 'speaking-prompt',
   3.0, 'medium', 1, NOW(), NOW()),
  (4, 'Do you think people should help each other more in society today? Why or why not?', 'speaking-prompt',
   3.0, 'hard', 2, NOW(), NOW());

-- Sample Support Tickets
INSERT INTO SupportTickets (userId, subject, description, status, priority, category, createdAt, updatedAt)
VALUES
  (2, 'Cannot access listening test', 'I am trying to start the listening practice test but keep getting an error message.', 'open', 'high', 'technical', NOW(), NOW()),
  (2, 'Question about payment plans', 'I would like to know if there are any discounts for students for the premium subscription.', 'open', 'medium', 'payment', NOW(), NOW());

-- Sample Ticket Messages
INSERT INTO TicketMessages (ticketId, userId, message, isAdminResponse, isRead, createdAt, updatedAt)
VALUES
  (1, 2, 'I am trying to start the listening practice test but keep getting an error message that says "Audio file not found". Can you please help?', FALSE, TRUE, NOW(), NOW()),
  (2, 2, 'I am a university student and would like to know if there are any discounts available for the premium subscription. Thank you.', FALSE, TRUE, NOW(), NOW());

-- Sample Speaking Schedule
INSERT INTO SpeakingSchedules (userId, testId, scheduledDate, duration, status, notes, createdAt, updatedAt)
VALUES
  (2, 4, DATE_ADD(NOW(), INTERVAL 3 DAY), 15, 'scheduled', 'Looking forward to the test', NOW(), NOW());

-- Sample Test Attempt
INSERT INTO TestAttempts (userId, testId, startTime, status, createdAt, updatedAt)
VALUES
  (2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'in-progress', NOW(), NOW());

-- Sample Answers
INSERT INTO Answers (testAttemptId, questionId, selectedOptions, isCorrect, score, timeSpent, createdAt, updatedAt)
VALUES
  (1, 1, '[3]', TRUE, 1.0, 120, NOW(), NOW()),
  (1, 2, '[2]', FALSE, 0.0, 98, NOW(), NOW());
