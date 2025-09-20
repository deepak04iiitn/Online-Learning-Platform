import express from 'express';
import { createCourse, deleteCourse, getCourseById, getCourses, searchCourses, updateCourse } from '../controllers/course.controller.js';
import { requireAnyRole, requireInstructor, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Course search route 
router.get('/search', verifyToken, requireAnyRole, searchCourses);

// Course management routes (Instructor only)
router.post('/create', verifyToken, requireInstructor, createCourse);
router.put('/:courseId/update', verifyToken, requireInstructor, updateCourse);
router.delete('/:courseId/delete', verifyToken, requireInstructor, deleteCourse);

// Course viewing routes (Both roles)
router.get('/all', verifyToken, requireAnyRole, getCourses);
router.get('/:courseId/details', verifyToken, requireAnyRole, getCourseById);

export default router;