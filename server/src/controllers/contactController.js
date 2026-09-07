import { z } from "zod";

import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";

const serviceOptions = [
  "web-development",
  "wordpress",
  "ui-ux",
  "graphic-design",
  "branding",
  "other",
];

const messageStatuses = [
  "new",
  "read",
  "replied",
  "archived",
];

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad en az 2 karakter olmalıdır.")
    .max(80, "Ad çok uzun."),
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin.")
    .max(160, "E-posta adresi çok uzun.")
    .transform((value) => value.toLowerCase()),
  company: z
    .string()
    .trim()
    .max(120, "Şirket adı çok uzun.")
    .optional()
    .default(""),
  service: z
    .union([z.enum(serviceOptions), z.literal("")])
    .optional()
    .default(""),
  budget: z
    .string()
    .trim()
    .max(100, "Bütçe bilgisi çok uzun.")
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(20, "Mesaj en az 20 karakter olmalıdır.")
    .max(3000, "Mesaj en fazla 3000 karakter olabilir."),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default(""),
});

const getPaginationValue = (value, fallback, maximum) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return Math.min(Math.max(parsedValue, 1), maximum);
};
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const createContactMessage = asyncHandler(async (req, res) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400);
    throw new Error(
      result.error.issues[0]?.message || "Form bilgileri geçersiz."
    );
  }

  const {
    website,
    ...messageData
  } = result.data;

  // Botların dolduracağı görünmez honeypot alanı.
  if (website) {
    return res.status(201).json({
      success: true,
      message: "Mesajınız alındı.",
    });
  }

  await ContactMessage.create(messageData);

  res.status(201).json({
    success: true,
    message:
      "Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğim.",
  });
});

export const getAdminMessages = asyncHandler(async (req, res) => {
  const page = getPaginationValue(req.query.page, 1, 100000);
  const limit = getPaginationValue(req.query.limit, 20, 100);

  const filter = {};

  if (messageStatuses.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: messages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getAdminMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id).lean();

  if (!message) {
    res.status(404);
    throw new Error("Mesaj bulunamadı.");
  }

  res.status(200).json({
    success: true,
    data: message,
  });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!messageStatuses.includes(status)) {
    res.status(400);
    throw new Error("Geçersiz mesaj durumu.");
  }

  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!message) {
    res.status(404);
    throw new Error("Mesaj bulunamadı.");
  }

  res.status(200).json({
    success: true,
    message: "Mesaj durumu güncellendi.",
    data: message,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Mesaj bulunamadı.");
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Mesaj kalıcı olarak silindi.",
  });
});

export const getAdminMessageStats = asyncHandler(
  async (req, res) => {
    const [statusSummary, recentMessages] =
      await Promise.all([
        ContactMessage.aggregate([
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]),

        ContactMessage.find()
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            "name email company service status createdAt"
          )
          .lean(),
      ]);

    const counts = {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
    };

    statusSummary.forEach((item) => {
      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          item._id
        )
      ) {
        counts[item._id] = item.count;
      }
    });

    const total = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        total,
        counts,
        recentMessages,
      },
    });
  }
);