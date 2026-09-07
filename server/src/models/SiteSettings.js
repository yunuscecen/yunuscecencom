import mongoose from "mongoose";

const navigationItemSchema = new mongoose.Schema({
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
  isExternal: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    default: "",
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },

    brand: {
      name: {
        type: String,
        default: "Yunus Çeçen",
        trim: true,
      },
      shortName: {
        type: String,
        default: "YÇ",
        trim: true,
      },
      profession: {
        type: String,
        default: "Software Developer & Designer",
        trim: true,
      },
      logoUrl: {
        type: String,
        default: "",
        trim: true,
      },
      logoPublicId: {
        type: String,
        default: "",
        trim: true,
      },
      logoAlt: {
        type: String,
        default: "",
        trim: true,
      },
    },

    header: {
      contactLabel: {
        type: String,
        default: "Projenizi Konuşalım",
        trim: true,
      },
      contactHref: {
        type: String,
        default: "/iletisim",
        trim: true,
      },
      showContactButton: {
        type: Boolean,
        default: true,
      },
    },

    navigation: {
      type: [navigationItemSchema],
      default: [],
    },

    contact: {
      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        default: "",
        trim: true,
      },
      location: {
        type: String,
        default: "Türkiye",
        trim: true,
      },
      availabilityText: {
        type: String,
        default: "Yeni freelance projeler için müsait.",
        trim: true,
      },
    },

    socials: {
      type: [socialLinkSchema],
      default: [],
    },

    footer: {
      eyebrow: {
        type: String,
        default: "Birlikte çalışalım",
        trim: true,
      },
      title: {
        type: String,
        default: "Aklındaki projeyi gerçeğe dönüştürelim.",
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
      copyrightText: {
        type: String,
        default: "Tüm hakları saklıdır.",
        trim: true,
      },
    },

    seo: {
      defaultTitle: {
        type: String,
        default: "Yunus Çeçen — Yazılım Geliştirici & Tasarımcı",
        trim: true,
      },
      titleTemplate: {
        type: String,
        default: "%s | Yunus Çeçen",
        trim: true,
      },
      description: {
        type: String,
        default: "",
        trim: true,
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);