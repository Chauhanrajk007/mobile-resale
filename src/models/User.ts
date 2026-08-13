import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "admin" | "technician" | "customer";
  technicianId: string;
  active: boolean;
  lastLogin: Date | null;
  emailNotifications?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "technician", "customer"], default: "customer" },
    technicianId: { type: String, unique: true, sparse: true },
    active: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("passwordHash") && !this.passwordHash.startsWith("$2")) {
    const bcrypt = await import("bcryptjs");
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  if (this.role === "technician" && !this.technicianId) {
    const count = await mongoose.model("User").countDocuments({ role: "technician" });
    this.technicianId = `CMP-T${String(count + 1).padStart(3, "0")}`;
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set("toJSON", {
  transform(_doc: unknown, ret: Record<string, unknown>) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
