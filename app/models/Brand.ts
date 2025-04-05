import mongoose, { Schema, models } from "mongoose";

export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Marka adı zorunludur"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Marka slug değeri zorunludur"],
      unique: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Eğer model zaten mevcutsa tekrar oluşturma
const Brand = models.Brand || mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;
