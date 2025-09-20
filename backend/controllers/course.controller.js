import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import Lecture from '../models/lecture.model.js';
import { errorHandler } from '../utils/error.js';


// Creating a new course (only instructors can create)
export const createCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const instructorId = req.user.id;

        if(!title || !description) 
        {
            return next(errorHandler(400, 'Title and description are required'));
        }

        if(title.trim().length < 3) 
        {
            return next(errorHandler(400, 'Title must be at least 3 characters long'));
        }

        if(description.trim().length < 10) 
        {
            return next(errorHandler(400, 'Description must be at least 10 characters long'));
        }

        // creating the new course
        const newCourse = new Course({
            title: title.trim(),
            description: description.trim(),
            instructor: instructorId,
            lectures: [],
            studentsEnrolled: []
        });

        const savedCourse = await newCourse.save();

        // adding course to the instructor's coursesCreated array
        await User.findByIdAndUpdate(
            instructorId,
            { $push: { coursesCreated: savedCourse._id } }
        );

        // Populating the instructor details
        const populatedCourse = await Course.findById(savedCourse._id)
            .populate('instructor', 'name email');

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: populatedCourse
        });

    } catch (error) {
        next(error);
    }
};


// Getting all courses
export const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name email')
            .populate({
                path: 'lectures',
                select: 'title type order'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        next(error);
    }
};


// Getting the courses by its ID
export const getCourseById = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate('instructor', 'name email')
            .populate({
                path: 'lectures',
                select: 'title type order content',
                options: { sort: { order: 1 } }
            })
            .populate('studentsEnrolled', 'name email');

        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        next(error);
    }
};


// Updating the course (instructors can update only their own courses)
export const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;
        const instructorId = req.user.id;

        // Finding the course and verifying its ownership
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        if(course.instructor.toString() !== instructorId) 
        {
            return next(errorHandler(403, 'You can only update your own courses'));
        }

        if(title && title.trim().length < 3) 
        {
            return next(errorHandler(400, 'Title must be at least 3 characters long'));
        }

        if(description && description.trim().length < 10) 
        {
            return next(errorHandler(400, 'Description must be at least 10 characters long'));
        }

        // Updating the course
        const updateData = {};
        if(title) updateData.title = title.trim();
        if(description) updateData.description = description.trim();

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        ).populate('instructor', 'name email');

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        });

    } catch (error) {
        next(error);
    }
};


// Deleting the course (instrcutors can delete only their own courses)
export const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        if(course.instructor.toString() !== instructorId) 
        {
            return next(errorHandler(403, 'You can only delete your own courses'));
        }

        // deleting all the lectures associated with this course
        await Lecture.deleteMany({ course: courseId });

        // removing the course from the instructor's coursesCreated array too
        await User.findByIdAndUpdate(
            instructorId,
            { $pull: { coursesCreated: courseId } }
        );

        // removing the course from the students enrolledCourses arrays also
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        // finally deleting the complete course itself
        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


// Searching courses by title or keywords 
export const searchCourses = async (req, res, next) => {
    try {
        const { q } = req.query;

        if(!q || q.trim().length === 0) 
        {
            return next(errorHandler(400, 'Search query is required'));
        }

        const searchQuery = q.trim();

        // searching in title and description 
        const courses = await Course.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        })
        .populate('instructor', 'name email')
        .populate({
            path: 'lectures',
            select: 'title type order'
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            searchQuery,
            totalResults: courses.length,
            courses
        });

    } catch (error) {
        next(error);
    }
};