import { z } from "zod";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getClearCookieOptions,
  getRefreshCookieOptions,
  hashToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin.")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Parola en az 8 karakter olmalıdır.")
    .max(128, "Parola çok uzun."),
});

const validateBody = (schema, body, res) => {
  const result = schema.safeParse(body);

  if (!result.success) {
    res.status(400);
    throw new Error(
      result.error.issues[0]?.message || "Gönderilen bilgiler geçersiz."
    );
  }

  return result.data;
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validateBody(loginSchema, req.body, res);

  const user = await User.findOne({ email }).select(
    "+password +refreshTokenHash"
  );

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("E-posta adresi veya parola hatalı.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Bu yönetici hesabı devre dışı.");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();

  await user.save();

  res.cookie(
    "refreshToken",
    refreshToken,
    getRefreshCookieOptions()
  );

  res.status(200).json({
    success: true,
    accessToken,
    user: serializeUser(user),
  });
});

export const refreshSession = asyncHandler(async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken;

  if (!currentRefreshToken) {
    res.status(401);
    throw new Error("Yenileme anahtarı bulunamadı.");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(currentRefreshToken);
  } catch {
    res.clearCookie("refreshToken", getClearCookieOptions());
    res.status(401);
    throw new Error("Oturum süresi dolmuş. Tekrar giriş yapın.");
  }

  if (decoded.type !== "refresh") {
    res.status(401);
    throw new Error("Geçersiz yenileme anahtarı.");
  }

  const user = await User.findById(decoded.sub).select(
    "+refreshTokenHash"
  );

  const currentTokenHash = hashToken(currentRefreshToken);

  if (
    !user ||
    !user.isActive ||
    !user.refreshTokenHash ||
    user.refreshTokenHash !== currentTokenHash
  ) {
    res.clearCookie("refreshToken", getClearCookieOptions());
    res.status(401);
    throw new Error("Oturum doğrulanamadı. Tekrar giriş yapın.");
  }

  const accessToken = generateAccessToken(user._id);
  const nextRefreshToken = generateRefreshToken(user._id);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshTokenHash: hashToken(nextRefreshToken),
      },
    }
  );

  res.cookie(
    "refreshToken",
    nextRefreshToken,
    getRefreshCookieOptions()
  );

  res.status(200).json({
    success: true,
    accessToken,
    user: serializeUser(user),
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      await User.updateOne(
        {
          _id: decoded.sub,
          refreshTokenHash: hashToken(refreshToken),
        },
        {
          $set: {
            refreshTokenHash: null,
          },
        }
      );
    } catch {
      // Geçersiz token olsa bile cookie temizlenir.
    }
  }

  res.clearCookie("refreshToken", getClearCookieOptions());

  res.status(200).json({
    success: true,
    message: "Oturum kapatıldı.",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: serializeUser(req.user),
  });
});