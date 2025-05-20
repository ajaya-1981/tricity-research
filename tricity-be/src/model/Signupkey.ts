import mongoose from "mongoose";

const SignupKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ["SUPERUSER"],
      default: "SUPERUSER",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SignupKey", SignupKeySchema);
