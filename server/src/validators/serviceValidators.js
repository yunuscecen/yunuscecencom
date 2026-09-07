import { z } from "zod";

const optionalText = (maximum) =>
  z.string().trim().max(maximum).default("");

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

const optionalImageUrlSchema = z
  .string()
  .trim()
  .max(500, "Görsel adresi çok uzun.")
  .refine(
    (value) =>
      value === "" || /^https?:\/\/\S+$/i.test(value),
    "Geçerli bir görsel adresi girin."
  )
  .default("");

const serviceImageSchema = z
  .object({
    url: optionalImageUrlSchema,
    publicId: optionalText(300),
    alt: optionalText(180),
  })
  .default({
    url: "",
    publicId: "",
    alt: "",
  });

export const serviceCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Hizmet başlığı zorunludur.")
    .max(180, "Hizmet başlığı çok uzun."),

  slug: optionalText(180),

  type: z.enum(["development", "design"], {
    message: "Geçerli bir hizmet türü seçin.",
  }),

  summary: z
    .string()
    .trim()
    .min(1, "Hizmet özeti zorunludur.")
    .max(300, "Hizmet özeti en fazla 300 karakter olabilir."),

  description: optionalText(10000),
  coverImage: serviceImageSchema,
  deliverables: stringListSchema,
  tools: stringListSchema,
  icon: optionalText(100),

  published: z.boolean().default(true),

  order: z.coerce
    .number()
    .int("Sıra değeri tam sayı olmalıdır.")
    .min(0, "Sıra değeri negatif olamaz.")
    .max(10000, "Sıra değeri çok büyük.")
    .default(0),
});

export const serviceUpdateSchema = serviceCreateSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Güncellenecek en az bir alan gönderilmelidir."
  );