import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import Progress from '../models/progress.model.js';
import { errorHandler } from '../utils/error.js';


// Enrolling the student in a course
export const enrollInCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Checking if a course even exists
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        // Checking if student is already enrolled in the course he is trying to enroll in
        const isEnrolled = course.studentsEnrolled.includes(studentId);
        if(isEnrolled) 
        {
            return next(errorHandler(400, 'You are already enrolled in this course'));
        }

        // Adding the student to course's enrolled students
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { studentsEnrolled: studentId } }
        );

        // Adding the course to student's enrolled courses
        await User.findByIdAndUpdate(
            studentId,
            { $push: { enrolledCourses: courseId } }
        );

        // Creating the initial progress record for the student
        const newProgress = new Progress({
            student: studentId,
            course: courseId,
            completedLectures: []
        });
        await newProgress.save();

        // Getting the updated course with all the populated data
        const updatedCourse = await Course.findById(courseId)
            .populate('instructor', 'name email')
            .populate('lectures', 'title type order');

        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in the course',
            course: updatedCourse
        });

    } catch (error) {
        next(error);
    }
};


// Getting all enrolled courses for a student
export const getEnrolledCourses = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        // Getting the student with enrolled courses
        const student = await User.findById(studentId)
            .populate({
                path: 'enrolledCourses',
                populate: [
                    {
                        path: 'instructor',
                        select: 'name email'
                    },
                    {
                        path: 'lectures',
                        select: 'title type order'
                    }
                ]
            });

        if(!student) 
        {
            return next(errorHandler(404, 'Student not found'));
        }

        // Getting the student's progress for each enrolled course
        const coursesWithProgress = await Promise.all(
            student.enrolledCourses.map(async (course) => {
                const progress = await Progress.findOne({
                    student: studentId,
                    course: course._id
                });

                const totalLectures = course.lectures.length;
                const completedLectures = progress ? progress.completedLectures.filter(cl => cl.isCompleted).length : 0;
                const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

                return {
                    ...course.toObject(),
                    progress: {
                        totalLectures,
                        completedLectures,
                        progressPercentage
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            totalEnrolledCourses: coursesWithProgress.length,
            enrolledCourses: coursesWithProgress
        });

    } catch (error) {
        next(error);
    }
};


// Unenrolling the student from a course
export const unenrollFromCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Checking if a course even exists from which the student wants to unenroll
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        // Checking if the student is enrolled or not in the course he is trying to unenroll from
        const isEnrolled = course.studentsEnrolled.includes(studentId);
        if(!isEnrolled) 
        {
            return next(errorHandler(400, 'You are not enrolled in this course'));
        }

        // Removing the student from course's enrolled students
        await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnrolled: studentId } }
        );

        // Removing the course from student's enrolled courses
        await User.findByIdAndUpdate(
            studentId,
            { $pull: { enrolledCourses: courseId } }
        );

        // Deleting the complete progress record
        await Progress.findOneAndDelete({
            student: studentId,
            course: courseId
        });

        res.status(200).json({
            success: true,
            message: 'Successfully unenrolled from the course'
        });

    } catch (error) {
        next(error);
    }
};


// Checking if the student is enrolled in a specific course or not
export const checkEnrollmentStatus = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        // Checkig if the course exists
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        // Checking the enrollment status of the student
        const isEnrolled = course.studentsEnrolled.includes(studentId);

        let progress = null;
        if(isEnrolled) 
        {
            const progressRecord = await Progress.findOne({
                student: studentId,
                course: courseId
            });

            if(progressRecord) 
            {
                const totalLectures = course.lectures.length;
                const completedLectures = progressRecord.completedLectures.filter(cl => cl.isCompleted).length;
                const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

                progress = {
                    totalLectures,
                    completedLectures,
                    progressPercentage
                };
            }
        }

        res.status(200).json({
            success: true,
            isEnrolled,
            progress,
            course: {
                _id: course._id,
                title: course.title,
                description: course.description
            }
        });

    } catch (error) {
        next(error);
    }
};