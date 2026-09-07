import { z } from "zod";

const optionalText = (maximum) =>
  z.string().trim().max(maximum).default("");

const optionalUrlSchema = z
  .string()
  .trim()
  .max(500, "Bağlantı adresi çok uzun.")
  .refine(
    (value) =>
      value === "" || /^https?:\/\/\S+$/i.test(value),
    "Geçerli bir HTTP veya HTTPS bağlantısı girin."
  )
  .default("");

const stringListSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Liste alanları boş bırakılamaz.")
      .max(200, "Liste öğesi çok uzun.")
  )
  .max(50, "En fazla 50 liste öğesi eklenebilir.")
  .default([]);

const imageSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Proje görseli zorunludur.")
    .max(500, "Görsel adresi çok uzun.")
    .refine(
      (value) => /^https?:\/\/\S+$/i.test(value),
      "Geçerli bir görsel adresi girin."
    ),

  publicId: optionalText(300),

  alt: z
    .string()
    .trim()
    .min(1, "Görsel alternatif metni zorunludur.")
    .max(180, "Alternatif metin çok uzun."),
});

export const projectCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Proje başlığı zorunludur.")
    .max(180, "Proje başlığı çok uzun."),

  slug: optionalText(180),

  category: z.enum(
    [
      "web-development",
      "wordpress",
      "ui-ux",
      "graphic-design",
      "branding",
      "other",
    ],
    {
      message: "Geçerli bir proje kategorisi seçin.",
    }
  ),

  shortDescription: z
    .string()
    .trim()
    .min(1, "Kısa açıklama zorunludur.")
    .max(300, "Kısa açıklama en fazla 300 karakter olabilir."),

  description: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Açıklama paragrafları boş olamaz.")
        .max(5000, "Açıklama paragrafı çok uzun.")
    )
    .max(50, "En fazla 50 açıklama paragrafı eklenebilir.")
    .default([]),

  coverImage: imageSchema,

  gallery: z
    .array(imageSchema)
    .max(30, "Projeye en fazla 30 galeri görseli eklenebilir.")
    .default([]),

  technologies: stringListSchema,
  services: stringListSchema,

  client: optionalText(160),
  year: optionalText(20),
  challenge: optionalText(10000),
  solution: optionalText(10000),
  results: stringListSchema,

  links: z
    .object({
      live: optionalUrlSchema,
      github: optionalUrlSchema,
      behance: optionalUrlSchema,
    })
    .default({
      live: "",
      github: "",
      behance: "",
    }),

  featured: z.boolean().default(false),
  published: z.boolean().default(false),

  order: z.coerce
    .number()
    .int("Sıra değeri tam sayı olmalıdır.")
    .min(0, "Sıra değeri negatif olamaz.")
    .max(10000, "Sıra değeri çok büyük.")
    .default(0),

  seo: z
    .object({
      title: optionalText(200),
      description: optionalText(320),
    })
    .default({
      title: "",
      description: "",
    }),
});

export const projectUpdateSchema = projectCreateSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Güncellenecek en az bir alan gönderilmelidir."
  );