import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Reading", "Quiz"],
      required: true,
    },

    content: {
      type: String, 
      default: "",
    },

    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    order: {
      type: Number, 
      required: true,
    },

  },

  { timestamps: true }

);


const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
