import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const terminal = readline.createInterface({ input, output });

try {
  await connectDB();

  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log(`Admin hesabı zaten mevcut: ${existingAdmin.email}`);
    process.exitCode = 1;
  } else {
    const name = (await terminal.question("Ad soyad: ")).trim();
    const email = (
      await terminal.question("E-posta adresi: ")
    )
      .trim()
      .toLowerCase();
    const password = await terminal.question(
      "Parola (en az 12 karakter): "
    );

    if (name.length < 2) {
      throw new Error("Ad soyad en az 2 karakter olmalıdır.");
    }

    if (!email.includes("@")) {
      throw new Error("Geçerli bir e-posta adresi girilmelidir.");
    }

    if (password.length < 12) {
      throw new Error("Parola en az 12 karakter olmalıdır.");
    }

    await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    console.log("Yönetici hesabı başarıyla oluşturuldu.");
  }
} catch (error) {
  console.error(`Yönetici oluşturulamadı: ${error.message}`);
  process.exitCode = 1;
} finally {
  terminal.close();
  await mongoose.connection.close();
}