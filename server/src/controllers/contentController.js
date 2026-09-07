import About from "../models/About.js";
import HomePage from "../models/HomePage.js";
import SiteSettings from "../models/SiteSettings.js";
import asyncHandler from "../utils/asyncHandler.js";
import pickFields from "../utils/pickFields.js";
import validateStructuredContent from "../utils/validateStructuredContent.js";

const contentModels = {
  settings: SiteSettings,
  home: HomePage,
  about: About,
};

const editableFields = {
  settings: [
    "brand",
    "header",
    "navigation",
    "contact",
    "socials",
    "footer",
    "seo",
  ],

  home: [
    "hero",
    "featuredMedia",
    "projectsIntro",
    "servicesIntro",
    "processIntro",
    "processSteps",
    "aboutPreview",
    "contactCta",
    "sections",
    "seo",
  ],

  about: [
    "eyebrow",
    "title",
    "introduction",
    "story",
    "profileImage",
    "skillGroups",
    "experience",
    "stats",
    "seo",
  ],
};

const getRequestedModel = (type, res) => {
  const Model = contentModels[type];

  if (!Model) {
    res.status(404);
    throw new Error(
      "İstenen içerik türü bulunamadı."
    );
  }

  return Model;
};

const getEditableFields = (type, res) => {
  const fields = editableFields[type];

  if (!fields) {
    res.status(404);
    throw new Error(
      "İstenen içerik türü bulunamadı."
    );
  }

  return fields;
};

export const getContent = asyncHandler(
  async (req, res) => {
    const Model = getRequestedModel(
      req.params.type,
      res
    );

    const document = await Model.findOne({
      key: "main",
    }).lean();

    if (!document) {
      res.status(404);
      throw new Error(
        "İçerik henüz oluşturulmamış."
      );
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  }
);

export const updateContent = asyncHandler(
  async (req, res) => {
    const contentType = req.params.type;

    const Model = getRequestedModel(
      contentType,
      res
    );

    const fields = getEditableFields(
      contentType,
      res
    );

    const pickedUpdates = pickFields(
      req.body || {},
      fields
    );

    const updates = validateStructuredContent(
      pickedUpdates,
      res
    );

    const document = await Model.findOneAndUpdate(
      {
        key: "main",
      },
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
      message:
        "İçerik başarıyla güncellendi.",
      data: document,
    });
  }
);