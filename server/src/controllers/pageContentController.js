import PageContent from "../models/PageContent.js";
import asyncHandler from "../utils/asyncHandler.js";
import pickFields from "../utils/pickFields.js";
import validateStructuredContent from "../utils/validateStructuredContent.js";

const editableFields = [
  "home",
  "projects",
  "services",
  "about",
  "projectDetail",
  "contact",
];

const findOrCreatePageContent = () =>
  PageContent.findOneAndUpdate(
    {
      key: "main",
    },
    {
      $setOnInsert: {
        key: "main",
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );

export const getPageContent = asyncHandler(
  async (req, res) => {
    const content =
      await findOrCreatePageContent();

    res.status(200).json({
      success: true,
      data: content,
    });
  }
);

export const updatePageContent = asyncHandler(
  async (req, res) => {
    const pickedUpdates = pickFields(
      req.body || {},
      editableFields
    );

    const updates = validateStructuredContent(
      pickedUpdates,
      res
    );

    const content =
      await PageContent.findOneAndUpdate(
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
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Sayfa metinleri başarıyla güncellendi.",
      data: content,
    });
  }
);