import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  role: String,
});

userSchema.methods.validatePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
