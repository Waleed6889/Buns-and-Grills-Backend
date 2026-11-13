
import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    promoLabel: String,
    description: { type: String, required: true },
    includedItems: [String],
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    image: String,
    alt: String,
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
