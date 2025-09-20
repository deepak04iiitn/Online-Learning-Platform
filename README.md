# Online Learning Platform

A comprehensive full-stack web application that enables instructors to create courses and manage lectures, while allowing students to browse courses, track progress, and complete learning materials including quizzes.

## Features

### User Management
- **User Registration & Authentication**: Secure signup/signin with role-based access (Instructor/Student)
- **Role-Based Authorization**: Protected routes and API endpoints based on user roles
- **Session Management**: JWT-based authentication with secure cookie storage

### Instructor Features
- **Course Management**: Create, update, and delete courses with titles and descriptions
- **Lecture Creation**: Add two types of lectures to courses:
  - **Reading Lectures**: Text-based content for learning materials
  - **Quiz Lectures**: Multiple-choice questions with correct answer tracking
- **Content Organization**: Automatic lecture ordering and course structure management
- **Dashboard Overview**: Comprehensive view of created courses and lecture statistics

### Student Features
- **Course Browsing**: View all available courses with search functionality
- **Course Enrollment**: Enroll in and unenroll from courses
- **Sequential Learning**: Access lectures in order, with next lecture unlocked after completion
- **Progress Tracking**: Visual progress indicators showing completion status
- **Quiz Taking**: Interactive quiz interface with real-time scoring
- **Dashboard**: Personal learning overview with enrolled courses and progress metrics

### Additional Features
- **Course Search**: Find courses by title or keywords
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Progress Updates**: Immediate feedback on learning progress
- **Comprehensive Error Handling**: User-friendly error messages and validation

## Technology Stack

### Frontend
- **React 19.1.1**: Modern UI library for building interactive user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Redux Toolkit**: State management for complex application state
- **React Router**: Client-side routing for single-page application
- **Lucide React**: Icon library for consistent UI elements

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for RESTful API development
- **MongoDB**: NoSQL database for flexible document storage
- **Mongoose**: Object Document Mapper for MongoDB

### Authentication & Security
- **JSON Web Tokens (JWT)**: Secure token-based authentication
- **bcryptjs**: Password hashing for secure credential storage
- **Cookie Parser**: Secure cookie handling for session management
- **CORS**: Cross-Origin Resource Sharing configuration

## Architecture Decisions

### Frontend Architecture
- **Component-Based Design**: Modular React components for reusability and maintainability
- **State Management**: Redux Toolkit for global state management with local component state for UI-specific data
- **Responsive Design**: Mobile-first approach using Tailwind CSS utilities

### Backend Architecture
- **RESTful API Design**: Clean, intuitive endpoints following REST conventions
- **MVC Pattern**: Separation of concerns with models, controllers, and routes
- **Middleware Architecture**: Layered approach for authentication, error handling, and request processing

### Database Design
- **Document-Based Storage**: MongoDB chosen for its flexibility with nested data structures (courses with lectures, progress tracking)
- **Relationship Modeling**: Reference-based relationships between users, courses, lectures, and progress records
- **Schema Validation**: Mongoose schemas with built-in validation and type checking

### Security Considerations
- **Role-Based Access Control**: Middleware functions for protecting routes based on user roles
- **Input Validation**: Comprehensive validation on both client and server sides
- **Secure Authentication**: HTTP-only cookies with environment-based security settings

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn package manager

## Local Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd online-learning-platform
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/online-learning-platform
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies

#### Backend Dependencies 
Being in root directory , run:
```bash
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Database Setup
Ensure MongoDB is running on your system:
```bash
# For macOS (using Homebrew)
brew services start mongodb/brew/mongodb-community

# For Linux (systemd)
sudo systemctl start mongod

# For Windows
net start MongoDB
```

## Running the Application

### Development Mode

#### Start Backend Server
Being in root directory, run:
```bash
npm start
```
The backend server will start on `http://localhost:3000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend application will be available at `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
cd ..
```

#### Start Production Server
```bash
npm start
```

## API Endpoints

### Authentication Routes
- `POST /backend/auth/signup` - User registration
- `POST /backend/auth/signin` - User login
- `POST /backend/auth/signout` - User logout

### Course Management (Instructors)
- `POST /backend/courses/create` - Create new course
- `GET /backend/courses/all` - Get all courses
- `GET /backend/courses/:courseId/details` - Get course details
- `PUT /backend/courses/:courseId/update` - Update course
- `DELETE /backend/courses/:courseId/delete` - Delete course
- `GET /backend/courses/search?q={query}` - Search courses

### Lecture Management (Instructors)
- `POST /backend/lectures/create` - Create new lecture
- `GET /backend/lectures/course/:courseId/lectures` - Get lectures by course
- `GET /backend/lectures/:lectureId/details` - Get lecture details
- `PUT /backend/lectures/:lectureId/update` - Update lecture
- `DELETE /backend/lectures/:lectureId/delete` - Delete lecture

### Student Operations
- `POST /backend/students/enroll/:courseId` - Enroll in course
- `DELETE /backend/students/unenroll/:courseId` - Unenroll from course
- `GET /backend/students/enrolled-courses` - Get enrolled courses
- `GET /backend/students/enrollment-status/:courseId` - Check enrollment status
- `GET /backend/students/progress/:courseId` - Get course progress
- `POST /backend/students/mark-started/:lectureId` - Mark lecture as started
- `POST /backend/students/mark-completed/:lectureId` - Mark lecture as completed

### Utility Routes
- `GET /backend/ping` - Health check endpoint

## Project Structure

```
online-learning-platform/
├── backend/
│   ├── controllers/         # Route handlers and business logic
│   ├── models/             # Database schemas and models
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper functions and middleware
│   └── index.js            # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # State management
│   │   └── App.jsx         # Main application component
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── package.json            # Backend dependencies
└── README.md               # Project documentation
```

## Usage Guide

### For Instructors
1. Register/login with "Instructor" role
2. Create courses from the dashboard
3. Add lectures (Reading or Quiz type) to courses
4. Monitor student enrollment and progress

### For Students
1. Register/login with "Student" role
2. Browse and enroll in available courses
3. Complete lectures sequentially
4. Take quizzes and track progress
5. View learning statistics on dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request


