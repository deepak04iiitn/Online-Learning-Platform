import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["Instructor", "Student"],
      required: true,
    },

    coursesCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

  },

  { timestamps: true }

);


const User = mongoose.model("User", userSchema);
export default User;
