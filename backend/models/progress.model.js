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

        score: {
          type: Number, 
          default: null,
        },

      },
    ],
  },

  { timestamps: true }

);


const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
