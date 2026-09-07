import ContactMessage from "../models/ContactMessage.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import { configureCloudinary } from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCloudinaryMediaTotal = async () => {
  try {
    const cloudinary = configureCloudinary();

    const result = await cloudinary.search
      .expression(
        "resource_type:image AND public_id:yunuscecencom/*"
      )
      .max_results(1)
      .execute();

    return {
      total: result.total_count || 0,
      available: true,
    };
  } catch (error) {
    console.error(
      "Cloudinary medya sayısı alınamadı:",
      error.message
    );

    return {
      total: 0,
      available: false,
    };
  }
};

export const getDashboardSummary = asyncHandler(
  async (req, res) => {
    const [
      totalProjects,
      publishedProjects,
      featuredProjects,
      draftProjects,
      totalServices,
      publishedServices,
      totalMessages,
      newMessages,
      repliedMessages,
      recentProjects,
      recentMessages,
      media,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({
        published: true,
      }),
      Project.countDocuments({
        featured: true,
      }),
      Project.countDocuments({
        published: false,
      }),

      Service.countDocuments(),
      Service.countDocuments({
        published: true,
      }),

      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({
        status: "new",
      }),
      ContactMessage.countDocuments({
        status: "replied",
      }),

      Project.find()
        .sort({
          updatedAt: -1,
        })
        .limit(5)
        .select(
          "title slug category coverImage published featured updatedAt"
        )
        .lean(),

      ContactMessage.find()
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "name email company service status message createdAt"
        )
        .lean(),

      getCloudinaryMediaTotal(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        projects: {
          total: totalProjects,
          published: publishedProjects,
          featured: featuredProjects,
          draft: draftProjects,
        },

        services: {
          total: totalServices,
          published: publishedServices,
          draft: Math.max(
            totalServices - publishedServices,
            0
          ),
        },

        messages: {
          total: totalMessages,
          new: newMessages,
          replied: repliedMessages,
        },

        media,

        recentProjects,
        recentMessages,
      },
    });
  }
);