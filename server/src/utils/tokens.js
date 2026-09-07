import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const getRequiredEnvironmentValue = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} ortam değişkeni tanımlanmamış.`);
  }

  return value;
};

export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      type: "access",
    },
    getRequiredEnvironmentValue("JWT_ACCESS_SECRET"),
    {
      subject: userId.toString(),
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      type: "refresh",
    },
    getRequiredEnvironmentValue("JWT_REFRESH_SECRET"),
    {
      subject: userId.toString(),
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    getRequiredEnvironmentValue("JWT_ACCESS_SECRET")
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    getRequiredEnvironmentValue("JWT_REFRESH_SECRET")
  );
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const getClearCookieOptions = () => {
  const { maxAge, ...options } = getRefreshCookieOptions();

  return options;
};