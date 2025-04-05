import mongoose, { Schema, models } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "İsim alanı zorunludur"],
    },
    email: {
      type: String,
      required: [true, "E-posta alanı zorunludur"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Şifre alanı zorunludur"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Eğer model zaten mevcutsa tekrar oluşturma
const User = models.User || mongoose.model<IUser>("User", userSchema);

export default User;
