import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    service: {
      type: String,
      enum: [
        "web-development",
        "wordpress",
        "ui-ux",
        "graphic-design",
        "branding",
        "other",
        "",
      ],
      default: "",
    },
    budget: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({
  status: 1,
  createdAt: -1,
});

export default mongoose.model("ContactMessage", contactMessageSchema);