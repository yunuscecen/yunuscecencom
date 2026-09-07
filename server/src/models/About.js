import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    alt: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const aboutSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },
    eyebrow: {
      type: String,
      default: "Hakkımda",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    introduction: {
      type: String,
      default: "",
      trim: true,
    },
    story: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: imageSchema,
      default: {},
    },
    skillGroups: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        items: {
          type: [String],
          default: [],
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    experience: [
      {
        company: {
          type: String,
          required: true,
          trim: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          default: "",
          trim: true,
        },
        startDate: {
          type: String,
          default: "",
          trim: true,
        },
        endDate: {
          type: String,
          default: "",
          trim: true,
        },
        isCurrent: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    stats: [
      {
        value: {
          type: String,
          required: true,
          trim: true,
        },
        label: {
          type: String,
          required: true,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
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

export default mongoose.model("About", aboutSchema);