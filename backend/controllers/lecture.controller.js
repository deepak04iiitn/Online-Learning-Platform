import Lecture from '../models/lecture.model.js';
import Course from '../models/course.model.js';
import Question from '../models/question.model.js';
import { errorHandler } from '../utils/error.js';


// Creating a new lecture (only instructors can create for their own courses)
export const createLecture = async (req, res, next) => {
    try {
        const { title, type, content, courseId, questions } = req.body;
        const instructorId = req.user.id;

        if(!title || !type || !courseId) 
        {
            return next(errorHandler(400, 'Title, type, and courseId are required'));
        }

        if(!['Reading', 'Quiz'].includes(type)) 
        {
            return next(errorHandler(400, 'Type must be either Reading or Quiz'));
        }

        if(title.trim().length < 3) 
        {
            return next(errorHandler(400, 'Title must be at least 3 characters long'));
        }

        // Verifying that the course exists and the instructor logged in owns it
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        if(course.instructor.toString() !== instructorId) 
        {
            return next(errorHandler(403, 'You can only add lectures to your own courses'));
        }

        // Validating the content based on type
        if(type === 'Reading' && (!content || content.trim().length === 0)) 
        {
            return next(errorHandler(400, 'Content is required for Reading lectures'));
        }

        if(type === 'Quiz' && (!questions || !Array.isArray(questions) || questions.length === 0)) 
        {
            return next(errorHandler(400, 'Questions are required for Quiz lectures'));
        }

        // Get the next order number
        const lectureCount = await Lecture.countDocuments({ course: courseId });
        const order = lectureCount + 1;

        // Create the lecture
        const newLecture = new Lecture({
            title: title.trim(),
            type,
            content: type === 'Reading' ? content.trim() : '',
            course: courseId,
            order,
            questions: []
        });

        const savedLecture = await newLecture.save();

        // Handling the quiz questions if it's a Quiz lecture
        if(type === 'Quiz' && questions && questions.length > 0) 
        {
            const createdQuestions = [];

            for(const questionData of questions) 
            {
                // Validating the question data
                if(!questionData.questionText || !questionData.options || !Array.isArray(questionData.options)) 
                {
                    return next(errorHandler(400, 'Invalid question format'));
                }

                if(questionData.options.length < 2) 
                {
                    return next(errorHandler(400, 'Each question must have at least 2 options'));
                }

                // Checking if at least one option is marked as correct
                const hasCorrectOption = questionData.options.some(option => option.isCorrect === true);
                if(!hasCorrectOption) 
                {
                    return next(errorHandler(400, 'Each question must have at least one correct option'));
                }

                // finally creating the question
                const newQuestion = new Question({
                    questionText: questionData.questionText.trim(),
                    options: questionData.options.map(option => ({
                        text: option.text.trim(),
                        isCorrect: option.isCorrect || false
                    }))
                });

                const savedQuestion = await newQuestion.save();
                createdQuestions.push(savedQuestion._id);
            }

            // now just update the lecture with these questions
            savedLecture.questions = createdQuestions;
            await savedLecture.save();
        }

        // now adding lecture to the course
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { lectures: savedLecture._id } }
        );

        // Populating and returning the lecture
        const populatedLecture = await Lecture.findById(savedLecture._id)
            .populate('course', 'title')
            .populate('questions');

        res.status(201).json({
            success: true,
            message: 'Lecture created successfully',
            lecture: populatedLecture
        });

    } catch (error) {
        next(error);
    }
};


// Getting the lectures by course ID
export const getLecturesByCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Verifying if the course exists
        const course = await Course.findById(courseId);
        if(!course) 
        {
            return next(errorHandler(404, 'Course not found'));
        }

        const lectures = await Lecture.find({ course: courseId })
            .populate('questions')
            .sort({ order: 1 });

        res.status(200).json(lectures);

    } catch (error) {
        next(error);
    }
};


// Getting the lectures by ID
export const getLectureById = async (req, res, next) => {
    try {
        const { lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId)
            .populate('course', 'title instructor')
            .populate('questions');

        if(!lecture) 
        {
            return next(errorHandler(404, 'Lecture not found'));
        }

        res.status(200).json({
            success: true,
            lecture
        });

    } catch (error) {
        next(error);
    }
};


// Updating the lecture (only instructors can update their own course lectures)
export const updateLecture = async (req, res, next) => {
    try {
        const { lectureId } = req.params;
        const { title, content, questions } = req.body;
        const instructorId = req.user.id;

        // Finding the lecture and verifying its ownership
        const lecture = await Lecture.findById(lectureId).populate('course');
        if(!lecture) 
        {
            return next(errorHandler(404, 'Lecture not found'));
        }

        if(lecture.course.instructor.toString() !== instructorId) 
        {
            return next(errorHandler(403, 'You can only update lectures in your own courses'));
        }

        if(title && title.trim().length < 3) 
        {
            return next(errorHandler(400, 'Title must be at least 3 characters long'));
        }

        // Updating the data
        const updateData = {};
        if(title) updateData.title = title.trim();
        if(content) updateData.content = content.trim();

        // Handling the quiz questions update
        if(lecture.type === 'Quiz' && questions && Array.isArray(questions)) 
        {
            // Deleting the existing questions
            await Question.deleteMany({ _id: { $in: lecture.questions } });

            // Creating new questions
            const createdQuestions = [];
            for(const questionData of questions) 
            {
                if(!questionData.questionText || !questionData.options || !Array.isArray(questionData.options)) 
                {
                    return next(errorHandler(400, 'Invalid question format'));
                }

                if(questionData.options.length < 2) 
                {
                    return next(errorHandler(400, 'Each question must have at least 2 options'));
                }

                const hasCorrectOption = questionData.options.some(option => option.isCorrect === true);
                if(!hasCorrectOption) 
                {
                    return next(errorHandler(400, 'Each question must have at least one correct option'));
                }

                const newQuestion = new Question({
                    questionText: questionData.questionText.trim(),
                    options: questionData.options.map(option => ({
                        text: option.text.trim(),
                        isCorrect: option.isCorrect || false
                    }))
                });

                const savedQuestion = await newQuestion.save();
                createdQuestions.push(savedQuestion._id);
            }

            updateData.questions = createdQuestions;
        }

        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            updateData,
            { new: true }
        )
        .populate('course', 'title')
        .populate('questions');

        res.status(200).json({
            success: true,
            message: 'Lecture updated successfully',
            lecture: updatedLecture
        });

    } catch (error) {
        next(error);
    }
};


// Deleting the lecture (only instructors can delete their own course lectures)
export const deleteLecture = async (req, res, next) => {
    try {
        const { lectureId } = req.params;
        const instructorId = req.user.id;

        // Finding the lecture and verifying its ownership
        const lecture = await Lecture.findById(lectureId).populate('course');
        if(!lecture) 
        {
            return next(errorHandler(404, 'Lecture not found'));
        }

        if(lecture.course.instructor.toString() !== instructorId) 
        {
            return next(errorHandler(403, 'You can only delete lectures in your own courses'));
        }

        // Deleting the associated questions if it's a quiz
        if(lecture.type === 'Quiz' && lecture.questions.length > 0) 
        {
            await Question.deleteMany({ _id: { $in: lecture.questions } });
        }

        // Removing the lecture from the associated course
        await Course.findByIdAndUpdate(
            lecture.course._id,
            { $pull: { lectures: lectureId } }
        );

        // Reordering the remaining lectures
        const remainingLectures = await Lecture.find({ 
            course: lecture.course._id,
            _id: { $ne: lectureId }
        }).sort({ order: 1 });

        for(let i = 0; i < remainingLectures.length; i++) 
        {
            remainingLectures[i].order = i + 1;
            await remainingLectures[i].save();
        }

        // Now finally deleting the lecture
        await Lecture.findByIdAndDelete(lectureId);

        res.status(200).json({
            success: true,
            message: 'Lecture deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};