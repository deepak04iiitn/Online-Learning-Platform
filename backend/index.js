import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import courseRoutes from './routes/course.route.js';

dotenv.config();

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


app.use('/backend/auth', authRoutes);
app.use('/backend/courses', courseRoutes);


app.get('/backend/ping', (req, res) => {
  res.status(200).send('pong');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});