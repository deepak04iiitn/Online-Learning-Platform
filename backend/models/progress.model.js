import mongoose, { Schema } from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLectures: [
      {
        lecture: {
          type: Schema.Types.ObjectId,
          ref: "Lecture",
        },

        isCompleted: {
          type: Boolean,
          default: false,
        },

        isPassed: {
            type: Boolean,
            default: true  // Default true for Reading lectures
        },

        score: {
          type: Number, 
          default: null,
        },

        correctAnswers: {
          type: Number,
          default: null
        },

        totalQuestions: {
          type: Number, 
          default: null
        }
      },
    ],
  },

  { timestamps: true }

);


const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
