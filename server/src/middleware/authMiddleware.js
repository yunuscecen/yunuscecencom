import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Bu işlem için giriş yapmalısınız.");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.type !== "access") {
      res.status(401);
      throw new Error("Geçersiz erişim anahtarı.");
    }

    const user = await User.findById(decoded.sub);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Kullanıcı bulunamadı veya devre dışı.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode !== 401) {
      res.status(401);
    }

    throw new Error("Oturum geçersiz veya süresi dolmuş.");
  }
});