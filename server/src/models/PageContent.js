import mongoose from "mongoose";

const schemaOptions = {
  _id: false,
};
const seoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 170,
    },
  },
  schemaOptions
);
const railItemSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "",
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
  schemaOptions
);

const optionSchema = new mongoose.Schema(
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
  schemaOptions
);

const homeContentSchema = new mongoose.Schema(
  {
    loadingKicker: {
      type: String,
      default: "YÇ / Loading",
      trim: true,
    },
    loadingText: {
      type: String,
      default: "Portfolio hazırlanıyor.",
      trim: true,
    },
    errorKicker: {
      type: String,
      default: "Connection error",
      trim: true,
    },
    errorTitle: {
      type: String,
      default: "İçerik yüklenemedi.",
      trim: true,
    },
    errorDescription: {
      type: String,
      default: "Backend sunucusunun çalıştığından emin olun.",
      trim: true,
    },
    coordinateLeft: {
      type: String,
      default: "CREATIVE WEB SOFTWARE AGENCY",
      trim: true,
    },
    coordinateRight: {
      type: String,
      default: "MINIMAL, CREATIVE AND INSPIRING DIGITAL EXPERIENCES",
      trim: true,
    },
    railItems: {
      type: [railItemSchema],
      default: () => [
        {
          eyebrow: "01 / Development",
          title: "Digital systems",
          description:
            "MERN ve WordPress ile ölçeklenebilir, yönetilebilir dijital ürünler.",
        },
        {
          eyebrow: "02 / Design",
          title: "Visual experiences",
          description:
            "Figma, Photoshop ve Illustrator ile güçlü arayüz ve görsel iletişim.",
        },
      ],
    },
    manifestoKicker: {
      type: String,
      default: "01 / Perspective",
      trim: true,
    },
    featuredImageLabel: {
      type: String,
      default: "Ana sayfa vitrin görseli — 16:9",
      trim: true,
    },
    featuredImageBadge: {
      type: String,
      default: "Featured visual / 01",
      trim: true,
    },
    featuredImageFallbackCaption: {
      type: String,
      default: "Development × Design",
      trim: true,
    },
    featuredImageRecommendation: {
      type: String,
      default: "1600 × 900 önerilir",
      trim: true,
    },
    projectsSectionNumber: {
      type: String,
      default: "02",
      trim: true,
    },
    allProjectsLabel: {
      type: String,
      default: "Tüm projeleri incele",
      trim: true,
    },
    servicesSectionNumber: {
      type: String,
      default: "03",
      trim: true,
    },
    processSectionNumber: {
      type: String,
      default: "04",
      trim: true,
    },
    aboutKicker: {
      type: String,
      default: "05 / About",
      trim: true,
    },
    aboutButtonLabel: {
      type: String,
      default: "Hakkımda",
      trim: true,
    },
  },
  schemaOptions
);

const projectsContentSchema = new mongoose.Schema(
  {
    heroKicker: {
      type: String,
      default: "Selected work / 01",
      trim: true,
    },
    title: {
      type: String,
      default: "Projeler",
      trim: true,
    },
    seo: {
  type: seoSchema,
  default: () => ({
    title: "Projeler",
    description:
      "Yazılım geliştirme, WordPress, UI/UX ve grafik tasarım projelerimi inceleyin.",
  }),
},
    description: {
      type: String,
      default:
        "Yazılım geliştirme, dijital ürün tasarımı ve görsel iletişimin kesişimindeki seçili çalışmalar.",
      trim: true,
    },
    countSuffix: {
      type: String,
      default: "proje",
      trim: true,
    },
    loadingText: {
      type: String,
      default: "Projeler yükleniyor.",
      trim: true,
    },
    errorText: {
      type: String,
      default: "Projeler şu anda yüklenemiyor.",
      trim: true,
    },
    emptyKicker: {
      type: String,
      default: "Archive / Empty",
      trim: true,
    },
    emptyTitle: {
      type: String,
      default: "Seçili projeler hazırlanıyor.",
      trim: true,
    },
    emptyDescription: {
      type: String,
      default:
        "Geliştirme ve tasarım çalışmalarından oluşan proje arşivi yakında burada yer alacak.",
      trim: true,
    },
  },
  schemaOptions
);

const servicesContentSchema = new mongoose.Schema(
  {
    heroKicker: {
      type: String,
      default: "Services / Capabilities",
      trim: true,
    },
    seo: {
  type: seoSchema,
  default: () => ({
    title: "Hizmetler",
    description:
      "MERN web geliştirme, WordPress, UI/UX ve grafik tasarım hizmetlerimi keşfedin.",
  }),
},
    title: {
      type: String,
      default: "Bir fikrin ihtiyaç duyduğu teknik ve görsel sistem.",
      trim: true,
    },
    description: {
      type: String,
      default:
        "Geliştirme ve tasarım hizmetleri birbirinden bağımsız veya uçtan uca tek bir üretim süreci olarak sunulabilir.",
      trim: true,
    },
    loadingText: {
      type: String,
      default: "Hizmetler yükleniyor.",
      trim: true,
    },
    errorText: {
      type: String,
      default: "Hizmetler şu anda yüklenemiyor.",
      trim: true,
    },
    emptyText: {
      type: String,
      default: "Hizmet içerikleri hazırlanıyor.",
      trim: true,
    },
    deliverablesLabel: {
      type: String,
      default: "Teslim kapsamı",
      trim: true,
    },
    contactButtonLabel: {
      type: String,
      default: "Projeyi konuşalım",
      trim: true,
    },
  },
  schemaOptions
);

const aboutContentSchema = new mongoose.Schema(
  {
    storyKicker: {
      type: String,
      default: "01 / Story",
      trim: true,
    },
    roleLabel: {
      type: String,
      default: "Role",
      trim: true,
    },
    locationLabel: {
      type: String,
      default: "Location",
      trim: true,
    },
    statusLabel: {
      type: String,
      default: "Status",
      trim: true,
    },
    skillsKicker: {
      type: String,
      default: "02 / Capabilities",
      trim: true,
    },
    skillsTitle: {
      type: String,
      default: "Teknik düşünce ve görsel tasarım tek sistemde.",
      trim: true,
    },
    experienceKicker: {
      type: String,
      default: "03 / Experience",
      trim: true,
    },
    experienceTitle: {
      type: String,
      default: "Deneyim ve çalışma geçmişi.",
      trim: true,
    },
    ctaKicker: {
      type: String,
      default: "04 / Collaboration",
      trim: true,
    },
    ctaTitle: {
      type: String,
      default: "Birlikte anlamlı bir dijital ürün tasarlayalım.",
      trim: true,
    },
    ctaButtonLabel: {
      type: String,
      default: "İletişime geç",
      trim: true,
    },
  },
  schemaOptions
);

const projectDetailContentSchema = new mongoose.Schema(
  {
    backLabel: {
      type: String,
      default: "Tüm projeler",
      trim: true,
    },
    clientLabel: {
      type: String,
      default: "Client",
      trim: true,
    },
    yearLabel: {
      type: String,
      default: "Year",
      trim: true,
    },
    servicesLabel: {
      type: String,
      default: "Services",
      trim: true,
    },
    technologyLabel: {
      type: String,
      default: "Technology",
      trim: true,
    },
    overviewKicker: {
      type: String,
      default: "Project overview",
      trim: true,
    },
    challengeKicker: {
      type: String,
      default: "01 / Challenge",
      trim: true,
    },
    challengeTitle: {
      type: String,
      default: "Problem",
      trim: true,
    },
    solutionKicker: {
      type: String,
      default: "02 / Solution",
      trim: true,
    },
    solutionTitle: {
      type: String,
      default: "Yaklaşım",
      trim: true,
    },
    galleryCaption: {
      type: String,
      default: "Project image",
      trim: true,
    },
    resultsKicker: {
      type: String,
      default: "03 / Results",
      trim: true,
    },
    resultsTitle: {
      type: String,
      default: "Ortaya çıkan sonuçlar",
      trim: true,
    },
    linksTitle: {
      type: String,
      default: "Projeyi görüntüle",
      trim: true,
    },
    liveLinkLabel: {
      type: String,
      default: "Canlı proje",
      trim: true,
    },
    githubLinkLabel: {
      type: String,
      default: "GitHub",
      trim: true,
    },
    behanceLinkLabel: {
      type: String,
      default: "Behance",
      trim: true,
    },
  },
  schemaOptions
);

const contactContentSchema = new mongoose.Schema(
  {
    heroKicker: {
      type: String,
      default: "Contact / Start a project",
      trim: true,
    },
    seo: {
  type: seoSchema,
  default: () => ({
    title: "İletişim",
    description:
      "Yeni bir yazılım veya tasarım projesi için benimle iletişime geçin.",
  }),
},
    title: {
      type: String,
      default: "Birlikte çalışan ve iz bırakan bir şey üretelim.",
      trim: true,
    },
    highlightedText: {
      type: String,
      default: "iz bırakan",
      trim: true,
    },
    emailLabel: {
      type: String,
      default: "E-posta",
      trim: true,
    },
    phoneLabel: {
      type: String,
      default: "Telefon",
      trim: true,
    },
    locationLabel: {
      type: String,
      default: "Konum",
      trim: true,
    },
    nameLabel: {
      type: String,
      default: "Ad soyad *",
      trim: true,
    },
    formEmailLabel: {
      type: String,
      default: "E-posta *",
      trim: true,
    },
    companyLabel: {
      type: String,
      default: "Şirket veya marka",
      trim: true,
    },
    serviceLabel: {
      type: String,
      default: "İlgilendiğin hizmet",
      trim: true,
    },
    servicePlaceholder: {
      type: String,
      default: "Seçiniz",
      trim: true,
    },
    serviceOptions: {
      type: [optionSchema],
      default: () => [
        {
          value: "web-development",
          label: "MERN Web Development",
          order: 1,
        },
        {
          value: "wordpress",
          label: "WordPress",
          order: 2,
        },
        {
          value: "ui-ux",
          label: "UI / UX Design",
          order: 3,
        },
        {
          value: "graphic-design",
          label: "Graphic Design",
          order: 4,
        },
        {
          value: "branding",
          label: "Branding",
          order: 5,
        },
        {
          value: "other",
          label: "Diğer",
          order: 6,
        },
      ],
    },
    budgetLabel: {
      type: String,
      default: "Tahmini bütçe",
      trim: true,
    },
    budgetPlaceholder: {
      type: String,
      default: "Belirtilmedi",
      trim: true,
    },
    budgetOptions: {
      type: [optionSchema],
      default: () => [
        {
          value: "10.000 - 25.000 TL",
          label: "10.000 – 25.000 TL",
          order: 1,
        },
        {
          value: "25.000 - 50.000 TL",
          label: "25.000 – 50.000 TL",
          order: 2,
        },
        {
          value: "50.000 - 100.000 TL",
          label: "50.000 – 100.000 TL",
          order: 3,
        },
        {
          value: "100.000 TL ve üzeri",
          label: "100.000 TL ve üzeri",
          order: 4,
        },
        {
          value: "Karar verilmedi",
          label: "Henüz karar verilmedi",
          order: 5,
        },
      ],
    },
    messageLabel: {
      type: String,
      default: "Projeden bahset *",
      trim: true,
    },
    consentText: {
      type: String,
      default:
        "Formu göndererek iletişim amacıyla verdiğiniz bilgilerin kullanılmasını kabul etmiş olursunuz.",
      trim: true,
    },
    submitLabel: {
      type: String,
      default: "Mesajı gönder",
      trim: true,
    },
    submittingLabel: {
      type: String,
      default: "Gönderiliyor...",
      trim: true,
    },
    errorMessage: {
      type: String,
      default: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      trim: true,
    },
  },
  schemaOptions
);

const pageContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },
    home: {
      type: homeContentSchema,
      default: () => ({}),
    },
    projects: {
      type: projectsContentSchema,
      default: () => ({}),
    },
    services: {
      type: servicesContentSchema,
      default: () => ({}),
    },
    about: {
      type: aboutContentSchema,
      default: () => ({}),
    },
    projectDetail: {
      type: projectDetailContentSchema,
      default: () => ({}),
    },
    contact: {
      type: contactContentSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PageContent", pageContentSchema);