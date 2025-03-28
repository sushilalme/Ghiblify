import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    upiId: { type: String, required: true },
    img: { type: String, required: true },
    emailAddress: { type: String, required: true },
    status: { 
      type: String, 
      required: true,
      enum: ['Pending', 'Rejected', 'Processed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;