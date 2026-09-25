import fs from "fs/promises";
import fsSync from "fs";
import { cloudinary } from "../../config/cloudinary.config.js";
import { ApiError } from "../../utils/apiError.js";

class CloudinaryService {
  async uploadOnCloudinary(localFilePath: string) {
    if (!localFilePath) {
      return null;
    }

    try {
      console.log("Uploading file:", localFilePath);

      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      console.log("FILE SUCCESSFULLY UPLOADED:", response.secure_url);

      try {
        await fs.unlink(localFilePath);
        console.log("Local file deleted successfully");
      } catch (deleteError: unknown) {
        if (deleteError instanceof Error) {
          console.error("Failed to delete local file:", deleteError.message);
        }
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("CLOUDINARY UPLOAD FAILED:", error.message);
      }

      try {
        if (fsSync.existsSync(localFilePath)) {
          await fs.unlink(localFilePath);

          console.log("Local file deleted after Cloudinary failure");
        }
      } catch (deleteError: unknown) {
        if (deleteError instanceof Error) {
          console.error("FAILED TO DELETE LOCAL FILE:", deleteError.message);
        }
      }

      throw error;
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[] = [],
  ): Promise<string[]> {
    if (!files.length) {
      throw new ApiError(400, "No files received!");
    }

    const urls: string[] = [];

    for (const file of files) {
      const uploadedFile = await this.uploadOnCloudinary(file.path);

      if (!uploadedFile?.secure_url) {
        throw new ApiError(500, "Failed to upload file");
      }

      urls.push(uploadedFile.secure_url);
    }

    return urls;
  }

  async uploadMultipleFilesWithUrl(files: Express.Multer.File[] = []): Promise<
    {
      url: string;
      uploadedAt: Date;
    }[]
  > {
    if (!files.length) {
      throw new ApiError(400, "No files provided");
    }

    const uploadedImages: {
      url: string;
      uploadedAt: Date;
    }[] = [];

    for (const file of files) {
      const result = await this.uploadOnCloudinary(file.path);

      if (!result?.secure_url) {
        throw new ApiError(500, "Failed to upload file");
      }

      uploadedImages.push({
        url: result.secure_url,
        uploadedAt: new Date(),
      });
    }

    return uploadedImages;
  }
}

export const cloudinaryService = new CloudinaryService();
