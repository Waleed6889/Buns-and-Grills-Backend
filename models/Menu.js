
import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    discountBadge: String,
    spiceLevel: String,
    image: String,
    alt: String,
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
