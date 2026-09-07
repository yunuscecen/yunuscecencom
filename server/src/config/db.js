import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI ortam değişkeni tanımlanmamış.");
  }

  const connection = await mongoose.connect(mongoUri);

  console.log(`MongoDB bağlantısı kuruldu: ${connection.connection.host}`);
};