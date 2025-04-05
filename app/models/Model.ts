import mongoose, { Schema, models } from "mongoose";

export interface IModel {
  _id?: string;
  name: string;
  slug: string;
  brandId: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const modelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: [true, "Model adı zorunludur"],
    },
    slug: {
      type: String,
      required: [true, "Model slug değeri zorunludur"],
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Marka ID değeri zorunludur"],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Eğer model zaten mevcutsa tekrar oluşturma
const Model = models.Model || mongoose.model<IModel>("Model", modelSchema);

export default Model;
