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
const isBehanceUrl = (value, pathnamePattern) => {
  if (!value) return false;

  try {
    const parsedUrl = new URL(value);

    return (
      parsedUrl.protocol === "https:" &&
      ["behance.net", "www.behance.net"].includes(
        parsedUrl.hostname
      ) &&
      pathnamePattern.test(parsedUrl.pathname)
    );
  } catch {
    return false;
  }
};

const isBehanceImageUrl = (value) => {
  if (!value) return false;

  try {
    const parsedUrl = new URL(value);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(".behance.net")
    );
  } catch {
    return false;
  }
};

const advertisingProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    projectUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) =>
          isBehanceUrl(value, /^\/gallery\/\d+\//),
        message: "Geçerli bir Behance proje adresi girin.",
      },
    },
    embedUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) =>
          isBehanceUrl(value, /^\/embed\/project\/\d+$/),
        message: "Geçerli bir Behance embed adresi girin.",
      },
    },
    coverUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isBehanceImageUrl,
        message: "Kapak görseli Behance üzerinden gelmelidir.",
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const advertisingPortfolioSchema = new mongoose.Schema(
  {
    isVisible: {
      type: Boolean,
      default: true,
    },
    eyebrow: {
      type: String,
      default: "AdFolio / Advertising archive",
      trim: true,
    },
    title: {
      type: String,
      default:
        "Markaların yalnızca görülmesini değil, hatırlanmasını tasarlıyorum.",
      trim: true,
    },
    description: {
      type: String,
      default:
        "Sosyal medya, kampanya ve dijital reklam çalışmalarımdan oluşan seçili bir görsel arşiv.",
      trim: true,
    },
    buttonLabel: {
      type: String,
      default: "Reklam tasarımlarını incele",
      trim: true,
    },
    pageKicker: {
      type: String,
      default: "Selected advertising work / Behance",
      trim: true,
    },
    pageTitle: {
      type: String,
      default: "Reklam Tasarımları",
      trim: true,
    },
    pageDescription: {
      type: String,
      default:
        "Farklı markalar, kampanyalar ve dijital platformlar için hazırladığım reklam ve sosyal medya tasarımları.",
      trim: true,
    },
    projects: {
      type: [advertisingProjectSchema],
      default: () => [
        {
          projectId: "211707071",
          title: "Reklam Tasarımları #1",
          projectUrl:
            "https://www.behance.net/gallery/211707071/AdFolio-Advertising-Social-Media-Design",
          embedUrl:
            "https://www.behance.net/embed/project/211707071?ilo0=1",
          coverUrl:
            "https://mir-s3-cdn-cf.behance.net/projects/max_808/96fadd211707071.Y3JvcCw4MDgsNjMyLDAsMA.png",
          order: 1,
          isVisible: true,
        },
        {
          projectId: "211707899",
          title: "Reklam Tasarımları #2",
          projectUrl:
            "https://www.behance.net/gallery/211707899/AdFolio-Advertising-Social-Media-Design",
          embedUrl:
            "https://www.behance.net/embed/project/211707899?ilo0=1",
          coverUrl:
            "https://mir-s3-cdn-cf.behance.net/projects/max_808/472eb1211707899.Y3JvcCw4MDgsNjMyLDAsMA.png",
          order: 2,
          isVisible: true,
        },
      ],
    },
    seo: {
      title: {
        type: String,
        default: "Reklam Tasarımları",
        trim: true,
        maxlength: 70,
      },
      description: {
        type: String,
        default:
          "Yunus Çeçen tarafından hazırlanan reklam ve sosyal medya tasarımı çalışmaları.",
        trim: true,
        maxlength: 170,
      },
    },
  },
  {
    _id: false,
  }
);
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

advertisingPortfolio: {
  type: advertisingPortfolioSchema,
  default: () => ({}),
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