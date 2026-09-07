import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import About from "../models/About.js";
import HomePage from "../models/HomePage.js";
import Service from "../models/Service.js";
import SiteSettings from "../models/SiteSettings.js";

const siteSettings = {
  key: "main",
  brand: {
    name: "Yunus Çeçen",
    shortName: "YÇ",
    profession: "Software Developer & Designer",
    logoUrl: "",
  },
  navigation: [
    {
      label: "Ana Sayfa",
      href: "/",
      order: 1,
      isVisible: true,
    },
    {
      label: "Projeler",
      href: "/projeler",
      order: 2,
      isVisible: true,
    },
    {
      label: "Hakkımda",
      href: "/hakkimda",
      order: 3,
      isVisible: true,
    },
    {
      label: "Hizmetler",
      href: "/hizmetler",
      order: 4,
      isVisible: true,
    },
    {
      label: "İletişim",
      href: "/iletisim",
      order: 5,
      isVisible: true,
    },
  ],
  contact: {
    email: "",
    phone: "",
    location: "Türkiye",
    availabilityText: "Yeni freelance projeler için müsait.",
  },
  socials: [],
  footer: {
    eyebrow: "Birlikte çalışalım",
    title: "İyi fikirleri çalışan ve hatırlanan deneyimlere dönüştürelim.",
    description:
      "Web geliştirme, WordPress ve görsel tasarım projeleri için iletişime geçebilirsiniz.",
    copyrightText: "Tüm hakları saklıdır.",
  },
  seo: {
    defaultTitle: "Yunus Çeçen — Yazılım Geliştirici & Tasarımcı",
    titleTemplate: "%s | Yunus Çeçen",
    description:
      "MERN, WordPress, UI/UX ve grafik tasarım alanlarında çalışan freelance yazılım geliştirici ve tasarımcı.",
    keywords: [
      "MERN developer",
      "WordPress developer",
      "freelance web developer",
      "UI UX designer",
      "grafik tasarımcı",
    ],
  },
};

const homePage = {
  key: "main",
  hero: {
    eyebrow: "Freelance Developer & Designer",
    title:
      "Web geliştirme ile görsel tasarımı aynı fikir etrafında buluşturuyorum.",
    highlightedText: "aynı fikir",
    description:
      "MERN ve WordPress ile çalışan dijital ürünler; Figma, Photoshop ve Illustrator ile güçlü görsel deneyimler tasarlıyorum.",
    primaryCta: {
      label: "Projeleri incele",
      href: "/projeler",
    },
    secondaryCta: {
      label: "Bir proje konuşalım",
      href: "/iletisim",
    },
  },
  projectsIntro: {
    eyebrow: "Seçili işler",
    title: "Kodun ve tasarımın birlikte çalıştığı projeler.",
    description:
      "Web geliştirme, arayüz tasarımı ve görsel kimlik alanlarından seçilmiş çalışmalar.",
  },
  servicesIntro: {
    eyebrow: "Neler yapıyorum?",
    title: "Teknik doğruluk ile görsel karakter arasında.",
    description:
      "İhtiyaca göre yalnızca geliştirme, yalnızca tasarım veya uçtan uca üretim desteği.",
  },
  processIntro: {
    eyebrow: "Çalışma biçimim",
    title: "Belirsizliği azaltan açık ve üretken bir süreç.",
  },
  processSteps: [
    {
      number: "01",
      title: "Keşif",
      description:
        "İhtiyacı, kullanıcıyı, hedefleri ve projenin sınırlarını birlikte netleştiririz.",
      order: 1,
    },
    {
      number: "02",
      title: "Yön",
      description:
        "Bilgi mimarisini, görsel yaklaşımı ve teknik çözümü belirleriz.",
      order: 2,
    },
    {
      number: "03",
      title: "Üretim",
      description:
        "Tasarım ve geliştirme sürecini düzenli paylaşımlar ve geri bildirimlerle ilerletiriz.",
      order: 3,
    },
    {
      number: "04",
      title: "Yayın",
      description:
        "Testlerin ardından projeyi yayına alır ve gerekli teslimleri tamamlarız.",
      order: 4,
    },
  ],
  aboutPreview: {
    eyebrow: "Hakkımda",
    title: "Hem sistemin nasıl çalıştığıyla hem nasıl hissettirdiğiyle ilgileniyorum.",
    description:
      "Yazılım ve tasarım disiplinlerini birbirinden ayırmadan, fikirleri kullanılabilir dijital deneyimlere dönüştürüyorum.",
  },
  contactCta: {
    eyebrow: "Yeni bir proje",
    title: "Birlikte dikkat çekici ve gerçekten çalışan bir şey üretelim.",
    buttonLabel: "İletişime geç",
  },
  sections: [
    { key: "hero", isVisible: true, order: 1 },
    { key: "projects", isVisible: true, order: 2 },
    { key: "services", isVisible: true, order: 3 },
    { key: "process", isVisible: true, order: 4 },
    { key: "about", isVisible: true, order: 5 },
    { key: "contact", isVisible: true, order: 6 },
  ],
  seo: {
    title: "Yazılım Geliştirici & Tasarımcı",
    description:
      "MERN, WordPress, UI/UX ve grafik tasarım alanlarında freelance hizmetler.",
  },
};

const about = {
  key: "main",
  eyebrow: "Hakkımda",
  title:
    "Fikirleri yalnızca güzel görünen değil, doğru çalışan deneyimlere dönüştürüyorum.",
  introduction:
    "Yazılım geliştirme ve tasarım disiplinlerini aynı üretim sürecinde bir araya getiren freelance bir geliştirici ve tasarımcıyım.",
  story: [
    "MERN teknolojileriyle modern web uygulamaları, WordPress ile yönetilebilir internet siteleri geliştiriyorum.",
    "Figma ile arayüz ve deneyim tasarımı; Photoshop ve Illustrator ile görsel iletişim çalışmaları hazırlıyorum.",
    "Bir projede teknik kararların görsel deneyimi, tasarım kararlarının da ürünün kullanılabilirliğini doğrudan etkilediğine inanıyorum.",
  ],
  skillGroups: [
    {
      title: "Development",
      items: [
        "MongoDB",
        "Express.js",
        "React",
        "Node.js",
        "WordPress",
        "REST API",
      ],
      order: 1,
    },
    {
      title: "Design",
      items: [
        "Figma",
        "Photoshop",
        "Illustrator",
        "UI/UX Design",
        "Graphic Design",
        "Visual Identity",
      ],
      order: 2,
    },
  ],
  experience: [],
  stats: [],
  seo: {
    title: "Hakkımda",
    description:
      "Yunus Çeçen’in yazılım geliştirme, web tasarımı ve grafik tasarım yaklaşımı.",
  },
};

const services = [
  {
    title: "MERN Web Development",
    slug: "mern-web-development",
    type: "development",
    summary:
      "React arayüzü ve Node.js API altyapısıyla ihtiyaca özel web uygulamaları.",
    description:
      "Performanslı, ölçeklenebilir ve yönetilebilir web uygulamalarının tasarım ve geliştirme süreci.",
    deliverables: [
      "React kullanıcı arayüzü",
      "Node.js ve Express API",
      "MongoDB veritabanı",
      "Responsive uygulama",
    ],
    tools: ["MongoDB", "Express.js", "React", "Node.js"],
    order: 1,
    published: true,
  },
  {
    title: "WordPress Development",
    slug: "wordpress-development",
    type: "development",
    summary:
      "Markaya ve içerik ihtiyaçlarına göre hazırlanmış yönetilebilir WordPress siteleri.",
    description:
      "Hazır şablon görünümünden uzak, içerik yönetimi kolay ve performans odaklı WordPress çözümleri.",
    deliverables: [
      "Özel arayüz uygulaması",
      "İçerik yönetimi",
      "Responsive geliştirme",
      "Temel performans optimizasyonu",
    ],
    tools: ["WordPress", "PHP", "JavaScript", "CSS"],
    order: 2,
    published: true,
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    type: "design",
    summary:
      "Kullanıcı ihtiyaçlarını ve marka karakterini buluşturan dijital ürün tasarımı.",
    description:
      "Bilgi mimarisinden etkileşim detaylarına kadar tutarlı ve uygulanabilir arayüz sistemleri.",
    deliverables: [
      "Wireframe",
      "Arayüz tasarımı",
      "Responsive ekranlar",
      "Tasarım sistemi",
    ],
    tools: ["Figma", "Photoshop"],
    order: 3,
    published: true,
  },
  {
    title: "Graphic & Visual Design",
    slug: "graphic-visual-design",
    type: "design",
    summary:
      "Dijital ve basılı mecralarda tutarlı bir görsel dil oluşturan tasarım çalışmaları.",
    description:
      "Markanın ihtiyacına göre görsel kimlik, sosyal medya ve iletişim materyalleri.",
    deliverables: [
      "Görsel kimlik",
      "Sosyal medya tasarımları",
      "Dijital materyaller",
      "Baskıya hazır çalışmalar",
    ],
    tools: ["Illustrator", "Photoshop", "Figma"],
    order: 4,
    published: true,
  },
];

try {
  await connectDB();

  await SiteSettings.updateOne(
    { key: "main" },
    { $setOnInsert: siteSettings },
    { upsert: true }
  );

  await HomePage.updateOne(
    { key: "main" },
    { $setOnInsert: homePage },
    { upsert: true }
  );

  await About.updateOne(
    { key: "main" },
    { $setOnInsert: about },
    { upsert: true }
  );

  for (const service of services) {
    await Service.updateOne(
      { slug: service.slug },
      { $setOnInsert: service },
      { upsert: true }
    );
  }

  console.log("Başlangıç içerikleri başarıyla oluşturuldu.");
} catch (error) {
  console.error(`İçerikler oluşturulamadı: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}