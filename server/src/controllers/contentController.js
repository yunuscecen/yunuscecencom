import About from "../models/About.js";
import HomePage from "../models/HomePage.js";
import SiteSettings from "../models/SiteSettings.js";
import asyncHandler from "../utils/asyncHandler.js";

const contentModels = {
  settings: SiteSettings,
  home: HomePage,
  about: About,
};

const getRequestedModel = (type, res) => {
  const Model = contentModels[type];

  if (!Model) {
    res.status(404);
    throw new Error("İstenen içerik türü bulunamadı.");
  }

  return Model;
};

export const getContent = asyncHandler(async (req, res) => {
  const Model = getRequestedModel(req.params.type, res);

  const document = await Model.findOne({ key: "main" }).lean();

  if (!document) {
    res.status(404);
    throw new Error("İçerik henüz oluşturulmamış.");
  }

  res.status(200).json({
    success: true,
    data: document,
  });
});

export const updateContent = asyncHandler(async (req, res) => {
  const Model = getRequestedModel(req.params.type, res);

  const {
    _id,
    key,
    createdAt,
    updatedAt,
    __v,
    ...updates
  } = req.body;

  const document = await Model.findOneAndUpdate(
    { key: "main" },
    {
      $set: updates,
      $setOnInsert: {
        key: "main",
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  res.status(200).json({
    success: true,
    message: "İçerik başarıyla güncellendi.",
    data: document,
  });
});