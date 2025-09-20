import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import courseRoutes from './routes/course.route.js';
import lectureRoutes from './routes/lecture.route.js';

dotenv.config();


// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB is connected!');
    })
    .catch((err) => {
        console.log(err);
    });


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    console.error('Error:', err);  
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});


// API endpoints
app.use('/backend/auth', authRoutes);
app.use('/backend/courses', courseRoutes);
app.use('/backend/lectures', lectureRoutes);


// Health check endpoint
app.get('/backend/ping', (req, res) => {
  res.status(200).send('pong');
});


// Starting the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});