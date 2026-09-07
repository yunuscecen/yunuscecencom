import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "web-development",
        "wordpress",
        "ui-ux",
        "graphic-design",
        "branding",
        "other",
      ],
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: imageSchema,
      required: true,
    },
    gallery: {
      type: [imageSchema],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    client: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      default: "",
      trim: true,
    },
    challenge: {
      type: String,
      default: "",
      trim: true,
    },
    solution: {
      type: String,
      default: "",
      trim: true,
    },
    results: {
      type: [String],
      default: [],
    },
    links: {
      live: {
        type: String,
        default: "",
        trim: true,
      },
      github: {
        type: String,
        default: "",
        trim: true,
      },
      behance: {
        type: String,
        default: "",
        trim: true,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    seo: {
      title: {
        type: String,
        default: "",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({
  published: 1,
  featured: -1,
  order: 1,
  createdAt: -1,
});

export default mongoose.model("Project", projectSchema);