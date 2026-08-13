import mongoose, { Schema } from "mongoose";

export interface IPhoneModel {
  _id: mongoose.Types.ObjectId;
  brand: string;
  model: string;
  variants: string[];
  active: boolean;
  createdAt: Date;
}

const phoneModelSchema = new Schema(
  {
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    variants: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

phoneModelSchema.index({ brand: 1, model: 1 }, { unique: true });

const PhoneModel = mongoose.models.PhoneModel || mongoose.model("PhoneModel", phoneModelSchema);
export default PhoneModel;
