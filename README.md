# Online Learning Platform

A comprehensive full-stack web application that enables instructors to create courses and manage lectures, while allowing students to browse courses, track progress, and complete learning materials including quizzes.

## Live Link:
- https://online-learning-platform-otgr.onrender.com

## Demo Video:
- https://youtu.be/VGOY0K11tnY

## Published API Documentation
- https://documenter.getpostman.com/view/47323260/2sB3HtFGvx

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

## Database Schemas

The application uses MongoDB with Mongoose ODM for data modeling. Below are the detailed schema definitions:

### User Schema
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  password: String (required, min 6 characters),
  role: String (enum: ["Instructor", "Student"], required),
  coursesCreated: [ObjectId] (ref: "Course"),
  enrolledCourses: [ObjectId] (ref: "Course"),
  timestamps: true
}
```

### Course Schema
```javascript
{
  title: String (required, trimmed),
  description: String (required),
  instructor: ObjectId (ref: "User", required),
  lectures: [ObjectId] (ref: "Lecture"),
  studentsEnrolled: [ObjectId] (ref: "User"),
  timestamps: true
}
```

### Lecture Schema
```javascript
{
  title: String (required, trimmed),
  type: String (enum: ["Reading", "Quiz"], required),
  content: String (default: ""),
  questions: [ObjectId] (ref: "Question"),
  course: ObjectId (ref: "Course", required),
  order: Number (required),
  timestamps: true
}
```

### Question Schema
```javascript
{
  questionText: String (required),
  options: [
    {
      text: String (required),
      isCorrect: Boolean (default: false)
    }
  ]
}
```

### Progress Schema
```javascript
{
  student: ObjectId (ref: "User", required),
  course: ObjectId (ref: "Course", required),
  completedLectures: [
    {
      lecture: ObjectId (ref: "Lecture"),
      isCompleted: Boolean (default: false),
      isPassed: Boolean (default: true),
      score: Number (default: null),
      correctAnswers: Number (default: null),
      totalQuestions: Number (default: null)
    }
  ],
  timestamps: true
}
```

### Schema Relationships

#### One-to-Many Relationships
- **User → Courses**: An instructor can create multiple courses
- **User → Enrollments**: A student can enroll in multiple courses
- **Course → Lectures**: A course can have multiple lectures
- **Lecture → Questions**: A quiz lecture can have multiple questions

#### Many-to-Many Relationships
- **Users ↔ Courses**: Students can enroll in multiple courses, courses can have multiple students

#### Tracking Relationships
- **Progress**: Links students to their course progress with detailed completion tracking
- **Lecture Completion**: Tracks individual lecture completion with scoring for quiz types

### Data Flow Examples

#### Course Creation Flow
1. Instructor creates course → Course document created
2. Course ID added to instructor's `coursesCreated` array
3. Lectures added → Lecture documents created with course reference
4. Questions added to quiz lectures → Question documents created

#### Student Enrollment Flow
1. Student enrolls → Course ID added to student's `enrolledCourses`
2. Student ID added to course's `studentsEnrolled`
3. Progress document created linking student and course
4. Lecture completion tracked in progress document

#### Progress Tracking Flow
1. Student starts lecture → Progress document updated
2. Reading lecture completed → `isCompleted: true, isPassed: true`
3. Quiz lecture completed → Score calculated, `isCompleted: true`, `isPassed` based on score
4. Next lecture unlocked based on completion status

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

## Screenshots:
<img width="1898" height="826" alt="image" src="https://github.com/user-attachments/assets/9c0a2f5c-be6c-4a26-81bd-a926ba39f798" />
<img width="1901" height="825" alt="image" src="https://github.com/user-attachments/assets/89313d90-fc19-4a14-b19c-e30bbacad572" />
<img width="1893" height="824" alt="image" src="https://github.com/user-attachments/assets/43b8849f-276f-4498-af3b-47ed5fdb3d64" />
<img width="1899" height="817" alt="image" src="https://github.com/user-attachments/assets/461d9a92-a4b5-44f9-bc16-2b377d72bef8" />
<img width="1893" height="802" alt="image" src="https://github.com/user-attachments/assets/7a1d7b24-557f-4355-9c14-95ed1c545188" />
<img width="1897" height="788" alt="image" src="https://github.com/user-attachments/assets/5b0b01c2-43f3-4573-b943-eb78c5bf961f" />
<img width="1889" height="820" alt="image" src="https://github.com/user-attachments/assets/ff1981c0-24cf-466b-b52d-93441b9c0bfc" />
<img width="667" height="616" alt="image" src="https://github.com/user-attachments/assets/a4a382e1-4961-4c8f-810a-4bddae18159b" />
<img width="1003" height="569" alt="image" src="https://github.com/user-attachments/assets/21d2ddae-201c-4e86-9743-0c1fbbc43c52" />
<img width="1894" height="822" alt="image" src="https://github.com/user-attachments/assets/0f420bbd-aaa5-420c-a1f6-656d81af975e" />
<img width="1899" height="690" alt="image" src="https://github.com/user-attachments/assets/98bd18e2-5081-490c-8d03-2291e9bd0259" />
<img width="1894" height="809" alt="image" src="https://github.com/user-attachments/assets/cadf33da-9dc2-4b97-95df-97d7c8f4d591" />
<img width="1896" height="811" alt="image" src="https://github.com/user-attachments/assets/6798ca39-e32d-462e-8109-fc463ca90862" />
<img width="1893" height="822" alt="image" src="https://github.com/user-attachments/assets/067612dc-492c-4319-af76-72abd33d11c9" />
<img width="1341" height="572" alt="image" src="https://github.com/user-attachments/assets/5bb7c9f9-5147-4733-9ccd-edef92002d11" />















