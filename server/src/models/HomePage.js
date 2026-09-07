import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
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
    caption: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const ctaSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const processStepSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const sectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      enum: [
        "hero",
        "projects",
        "services",
        "process",
        "about",
        "contact",
      ],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const homePageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },

    hero: {
      eyebrow: {
        type: String,
        default: "Freelance Developer & Designer",
        trim: true,
      },
      title: {
        type: String,
        default:
          "Kod ve tasarım arasında dijital deneyimler üretiyorum.",
        trim: true,
      },
      highlightedText: {
        type: String,
        default: "dijital deneyimler",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
      primaryCta: {
        type: ctaSchema,
        default: {
          label: "Projeleri incele",
          href: "/projeler",
        },
      },
      secondaryCta: {
        type: ctaSchema,
        default: {
          label: "Bir proje konuşalım",
          href: "/iletisim",
        },
      },
    },

    featuredMedia: {
      type: mediaSchema,
      default: () => ({}),
    },

    projectsIntro: {
      eyebrow: {
        type: String,
        default: "Seçili işler",
        trim: true,
      },
      title: {
        type: String,
        default: "Son projeler",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    servicesIntro: {
      eyebrow: {
        type: String,
        default: "Neler yapıyorum?",
        trim: true,
      },
      title: {
        type: String,
        default: "Kod, tasarım ve ikisinin kesişimi.",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    processIntro: {
      eyebrow: {
        type: String,
        default: "Çalışma biçimim",
        trim: true,
      },
      title: {
        type: String,
        default: "Fikirden yayına kadar açık ve sade bir süreç.",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    processSteps: {
      type: [processStepSchema],
      default: [],
    },

    aboutPreview: {
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
      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    contactCta: {
      eyebrow: {
        type: String,
        default: "Bir fikrin mi var?",
        trim: true,
      },
      title: {
        type: String,
        default: "Birlikte dikkat çekici bir şey üretelim.",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
      buttonLabel: {
        type: String,
        default: "İletişime geç",
        trim: true,
      },
      buttonHref: {
        type: String,
        default: "/iletisim",
        trim: true,
      },
    },

    sections: {
      type: [sectionSchema],
      default: [
        { key: "hero", isVisible: true, order: 1 },
        { key: "projects", isVisible: true, order: 2 },
        { key: "services", isVisible: true, order: 3 },
        { key: "process", isVisible: true, order: 4 },
        { key: "about", isVisible: true, order: 5 },
        { key: "contact", isVisible: true, order: 6 },
      ],
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

export default mongoose.model("HomePage", homePageSchema);