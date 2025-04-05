import mongoose, { Schema, models } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  brandId: mongoose.Types.ObjectId;
  modelId: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  features: {
    [key: string]: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Ürün adı zorunludur"],
    },
    slug: {
      type: String,
      required: [true, "Ürün slug değeri zorunludur"],
      unique: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Marka ID değeri zorunludur"],
    },
    modelId: {
      type: Schema.Types.ObjectId,
      ref: "Model",
      required: [true, "Model ID değeri zorunludur"],
    },
    price: {
      type: Number,
      required: [true, "Fiyat zorunludur"],
      min: [0, "Fiyat 0'dan küçük olamaz"],
    },
    stock: {
      type: Number,
      required: [true, "Stok miktarı zorunludur"],
      min: [0, "Stok miktarı 0'dan küçük olamaz"],
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    features: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Eğer model zaten mevcutsa tekrar oluşturma
const Product =
  models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
