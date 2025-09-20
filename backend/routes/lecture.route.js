import express from 'express';
import { createLecture, deleteLecture, getLectureById, getLecturesByCourse, updateLecture } from '../controllers/lecture.controller.js';
import { requireAnyRole, requireInstructor, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Lecture management routes (Instructor only)
router.post('/create', verifyToken, requireInstructor, createLecture);
router.put('/:lectureId/update', verifyToken, requireInstructor, updateLecture);
router.delete('/:lectureId/delete', verifyToken, requireInstructor, deleteLecture);

// Lecture viewing routes (Both roles)
router.get('/course/:courseId/lectures', verifyToken, requireAnyRole, getLecturesByCourse);
router.get('/:lectureId/details', verifyToken, requireAnyRole, getLectureById);

export default router;