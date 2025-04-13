-- MySQL schema for IELTS Preparation Platform

-- Drop Database if it exists to start fresh
DROP DATABASE IF EXISTS ielts_prep_db;
CREATE DATABASE ielts_prep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ielts_prep_db;

-- Users Table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  profileImage VARCHAR(255),
  lastLogin DATETIME,
  targetBand FLOAT,
  examDate DATETIME,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Tests Table
CREATE TABLE Tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('listening', 'reading', 'writing', 'speaking', 'full') NOT NULL,
  difficultyLevel ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  duration INT NOT NULL COMMENT 'Duration in minutes',
  instructions TEXT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  isPremium BOOLEAN DEFAULT FALSE,
  createdBy INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_difficulty (difficultyLevel),
  INDEX idx_isActive (isActive)
);

-- Questions Table
CREATE TABLE Questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  testId INT NOT NULL,
  questionText TEXT NOT NULL,
  questionType ENUM(
    'multiple-choice',
    'true-false',
    'matching',
    'fill-blank',
    'essay',
    'short-answer',
    'speaking-prompt'
  ) NOT NULL,
  options JSON COMMENT 'JSON array of options for MCQs, matching, etc.',
  correctAnswer TEXT COMMENT 'For objective questions. For subjective, it will be null.',
  marks FLOAT NOT NULL DEFAULT 1.0,
  explanation TEXT,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  section VARCHAR(255) COMMENT 'Section or passage this question belongs to',
  audioFile VARCHAR(255) COMMENT 'Path to audio file for listening questions',
  imageFile VARCHAR(255) COMMENT 'Path to image file if question has an image',
  `order` INT NOT NULL DEFAULT 0 COMMENT 'Order of question in the test',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (testId) REFERENCES Tests(id) ON DELETE CASCADE,
  INDEX idx_testId (testId),
  INDEX idx_order (`order`)
);

-- TestAttempts Table
CREATE TABLE TestAttempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  testId INT NOT NULL,
  startTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  endTime DATETIME,
  totalScore FLOAT,
  bandScore FLOAT COMMENT 'IELTS band score (0-9)',
  status ENUM('in-progress', 'completed', 'submitted', 'reviewed') DEFAULT 'in-progress',
  feedback TEXT COMMENT 'Admin feedback on writing/speaking tests',
  feedbackBy INT COMMENT 'Admin who provided feedback',
  feedbackDate DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (testId) REFERENCES Tests(id) ON DELETE CASCADE,
  FOREIGN KEY (feedbackBy) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_testId (testId),
  INDEX idx_status (status)
);

-- Answers Table
CREATE TABLE Answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  testAttemptId INT NOT NULL,
  questionId INT NOT NULL,
  answerText TEXT,
  selectedOptions JSON COMMENT 'JSON array of selected options for MCQs',
  isCorrect BOOLEAN COMMENT 'For objective questions',
  score FLOAT COMMENT 'Score for this answer',
  feedback TEXT COMMENT 'Feedback for this specific answer',
  audioRecording VARCHAR(255) COMMENT 'Path to audio recording for speaking answers',
  timeSpent INT COMMENT 'Time spent on this question in seconds',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (testAttemptId) REFERENCES TestAttempts(id) ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES Questions(id) ON DELETE CASCADE,
  INDEX idx_testAttemptId (testAttemptId),
  INDEX idx_questionId (questionId)
);

-- SpeakingSchedule Table
CREATE TABLE SpeakingSchedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  testId INT COMMENT 'Optional specific test to be used',
  examinerUserId INT COMMENT 'Admin who will conduct the speaking test',
  scheduledDate DATETIME NOT NULL,
  duration INT NOT NULL DEFAULT 15 COMMENT 'Duration in minutes',
  status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
  meetingLink VARCHAR(255) COMMENT 'Zoom/Google Meet/etc meeting link',
  notes TEXT,
  testAttemptId INT COMMENT 'Created when the test is completed and results are recorded',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (testId) REFERENCES Tests(id) ON DELETE SET NULL,
  FOREIGN KEY (examinerUserId) REFERENCES Users(id) ON DELETE SET NULL,
  FOREIGN KEY (testAttemptId) REFERENCES TestAttempts(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_examinerUserId (examinerUserId),
  INDEX idx_scheduledDate (scheduledDate),
  INDEX idx_status (status)
);

-- SupportTickets Table
CREATE TABLE SupportTickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  category ENUM(
    'technical',
    'account',
    'payment',
    'content',
    'feedback',
    'other'
  ) DEFAULT 'other',
  assignedTo INT COMMENT 'Admin who is assigned to the ticket',
  resolvedDate DATETIME,
  closedDate DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_assignedTo (assignedTo),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- TicketMessages Table
CREATE TABLE TicketMessages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticketId INT NOT NULL,
  userId INT NOT NULL,
  message TEXT NOT NULL,
  attachmentUrl VARCHAR(255),
  isAdminResponse BOOLEAN DEFAULT FALSE,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticketId) REFERENCES SupportTickets(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_ticketId (ticketId),
  INDEX idx_userId (userId),
  INDEX idx_isAdminResponse (isAdminResponse),
  INDEX idx_isRead (isRead)
);

-- Add Sample Admin User (password: admin123)
INSERT INTO Users (firstname, lastname, email, password, role, createdAt, updatedAt)
VALUES ('Admin', 'User', 'admin@example.com', '$2b$10$FH5eIbIJSXKHCGI9JJn1wOY1y4BeuRhXBzn98lHKL558gzSKsfchm', 'admin', NOW(), NOW());

-- Add Sample Regular User (password: user123)
INSERT INTO Users (firstname, lastname, email, password, createdAt, updatedAt)
VALUES ('Regular', 'User', 'user@example.com', '$2b$10$9eT36pHwHVd85M7QsTB4huwhvR0OKNJuVDORTzc3sBnixVREWXPKK', NOW(), NOW());
