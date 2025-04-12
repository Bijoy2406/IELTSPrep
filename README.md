# IELTS Preparation Application

A full-stack web application for IELTS test preparation, providing mock tests, feedback, and progress tracking for students preparing for the IELTS exam.

## Features

- User authentication (sign up, log in)
- Mock tests for all IELTS components:
  - Listening
  - Reading
  - Writing
  - Speaking
- Submit writing answers for review
- Schedule and manage speaking test sessions
- Track test history and progress
- Online support chat/ticket system
- Admin panel for managing users, tests, and reviewing submissions

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Styled Components for styling
- Formik and Yup for form validation
- Axios for API calls
- Chart.js for visualizations

### Backend
- Node.js
- Express.js
- MySQL database
- Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- MySQL (v8.x or higher)
- Bun (v1.x) - recommended for better package management

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/ielts-prep-app.git
cd ielts-prep-app
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
bun install

# Install frontend dependencies
cd ../client
bun install
```

3. Configure environment variables
```bash
# In the server directory, create a .env file
cp .env.example .env
```

Edit the `.env` file to add your database credentials and other configuration.

4. Initialize the database
```bash
# Create and configure your MySQL database
mysql -u root -p
CREATE DATABASE ielts_prep_db;
EXIT;
```

5. Start the development servers
```bash
# Start backend server
cd server
bun run dev

# In a new terminal, start frontend server
cd client
bun run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ielts-prep-app/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source files
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable components
│       ├── context/        # React context providers
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       ├── services/       # API service functions
│       └── utils/          # Utility functions
│
└── server/                 # Backend Node.js application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middlewares/        # Express middlewares
    ├── models/             # Sequelize models
    ├── routes/             # API routes
    ├── services/           # Business logic
    └── utils/              # Utility functions
```

## API Documentation

The API endpoints are organized by resource:

- `/api/auth` - Authentication (login, register, etc.)
- `/api/tests` - IELTS tests and questions
- `/api/speaking-tests` - Speaking test scheduling
- `/api/support` - Support ticket system
- `/api/admin` - Admin-only operations

For detailed API documentation, please refer to the [API Documentation](API.md) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
