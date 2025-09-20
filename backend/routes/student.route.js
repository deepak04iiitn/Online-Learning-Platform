import express from 'express';
import { checkEnrollmentStatus, enrollInCourse, getEnrolledCourses, unenrollFromCourse } from '../controllers/student.controller.js';
import { requireStudent, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Student enrollment routes (Student only)
router.post('/enroll/:courseId', verifyToken, requireStudent, enrollInCourse);
router.delete('/unenroll/:courseId', verifyToken, requireStudent, unenrollFromCourse);

// Student course viewing routes (Student only)
router.get('/enrolled-courses', verifyToken, requireStudent, getEnrolledCourses);
router.get('/enrollment-status/:courseId', verifyToken, requireStudent, checkEnrollmentStatus);

export default router;