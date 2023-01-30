import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
