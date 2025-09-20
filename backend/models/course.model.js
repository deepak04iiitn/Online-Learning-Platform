import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    studentsEnrolled: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

  },

  { timestamps: true }

);


const Course = mongoose.model("Course", courseSchema);
export default Course;
