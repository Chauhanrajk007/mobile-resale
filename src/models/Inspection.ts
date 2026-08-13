import mongoose, { Schema } from "mongoose";

/* ---------- sub-schemas ---------- */

const testResultSchema = new Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    result: { type: String, enum: ["pass", "fail", "not_tested"], default: "not_tested" },
    comment: { type: String, default: "" },
  },
  { _id: false }
);

const physicalSchema = new Schema(
  {
    screen: { type: String, enum: ["excellent", "good", "fair", "poor", "damaged"], default: "good" },
    backPanel: { type: String, enum: ["excellent", "good", "fair", "poor", "damaged"], default: "good" },
    frame: { type: String, enum: ["excellent", "good", "fair", "poor", "damaged"], default: "good" },
    cameraGlass: { type: String, enum: ["excellent", "good", "fair", "poor", "damaged"], default: "good" },
    scratches: { type: String, enum: ["none", "minor", "moderate", "heavy"], default: "none" },
    dents: { type: String, enum: ["none", "minor", "moderate", "heavy"], default: "none" },
    cracks: { type: String, enum: ["none", "minor", "moderate", "heavy"], default: "none" },
    waterDamage: { type: Boolean, default: false },
    missingParts: { type: String, default: "" },
    otherDamage: { type: String, default: "" },
    overallBody: { type: String, enum: ["excellent", "good", "fair", "poor", "damaged"], default: "good" },
  },
  { _id: false }
);

const photoSchema = new Schema(
  {
    label: { type: String, default: "" },
    data: { type: String, required: true },
    mimeType: { type: String, default: "image/jpeg" },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    address: { type: String, default: "" },
  },
  { _id: false }
);

/* ---------- main schema ---------- */

export interface IInspection {
  inspectionId: string;
  technician: mongoose.Types.ObjectId;
  phone: {
    brand: string;
    model: string;
    variant: string;
    imei: string;
    serialNumber: string;
  };
  deviceInfo: {
    storage: string;
    color: string;
    os: string;
    status: string;
    blacklistStatus: string;
    warrantyInfo: string;
  };
  tests: Array<{
    category: string;
    name: string;
    result: "pass" | "fail" | "not_tested";
    comment: string;
  }>;
  physicalCondition: {
    screen: string;
    backPanel: string;
    frame: string;
    cameraGlass: string;
    scratches: string;
    dents: string;
    cracks: string;
    waterDamage: boolean;
    missingParts: string;
    otherDamage: string;
    overallBody: string;
  };
  photos: Array<{ label: string; data: string; mimeType: string }>;
  location: { lat: number | null; lng: number | null; address: string };
  overallResult: "pass" | "fail" | "conditional";
  comments: string;
  status: "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

const inspectionSchema = new Schema<IInspection>(
  {
    inspectionId: { type: String, required: true, unique: true },
    technician: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      variant: { type: String, default: "" },
      imei: { type: String, default: "" },
      serialNumber: { type: String, default: "" },
    },
    deviceInfo: {
      storage: { type: String, default: "" },
      color: { type: String, default: "" },
      os: { type: String, default: "" },
      status: { type: String, default: "" },
      blacklistStatus: { type: String, default: "" },
      warrantyInfo: { type: String, default: "" },
    },
    tests: [testResultSchema],
    physicalCondition: { type: physicalSchema, default: () => ({}) },
    photos: [photoSchema],
    location: { type: locationSchema, default: () => ({}) },
    overallResult: { type: String, enum: ["pass", "fail", "conditional"], default: "conditional" },
    comments: { type: String, default: "" },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

inspectionSchema.index({ "phone.imei": 1 });
inspectionSchema.index({ technician: 1, createdAt: -1 });
inspectionSchema.index({ status: 1 });
inspectionSchema.index({ createdAt: -1 });

export default mongoose.models.Inspection || mongoose.model("Inspection", inspectionSchema);
