import File from "../models/file.model.js";
import uploadFile from "../utils/cloudinary.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";
import { v2 as cloudinary } from "cloudinary";

const createFiles = async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) return sendErrorResponse(res, "All fields are required", 400);

  try {
    if (!req.files || !req.files["files"]) {
      return sendErrorResponse(res, "Files not found", 400);
    }

    const files = req.files["files"];
    await Promise.all(
      files.map(async (file) => {
        try {
          const result = await uploadFile(file.path);
          const newFile = await File.create({
            owner: req.user._id,
            fileName: file.originalname,
            fileUrl: result.secure_url,
            publicId: result.public_id,
            fileInfo: {
              width: result.width,
              height: result.height,
              size: result.size,
              resource_type: result.resource_type,
              format: result.format,
              bytes: result.bytes,
            },
            folderId: folderId,
          });
          console.log("File created successfully:", newFile);
        } catch (error) {
          console.error("Error creating file:", error);
          throw error; // Propagate the error to the catch block below
        }
      })
    );

    return sendSuccessResponse(res, "Files uploaded successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const getFiles = async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) return sendErrorResponse(res, "All fields are required", 400);
  try {
    const files = await File.find({ folderId: folderId });
    if (!files) return sendErrorResponse(res, "Files not found", 404);
    return sendSuccessResponse(res, "Files fetched successfully", 200, files);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const deleteFiles = async (req, res) => {
  const { fileIds } = req.body;
  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return sendErrorResponse(res, "File IDs are required", 400);
  }
  try {
    await Promise.all(
      fileIds.map(async (fileId) => {
        try {
          const file = await File.findById(fileId);
          if (!file) {
            throw new Error("File not found");
          }
          const cldFile = await cloudinary.uploader.destroy(file.publicId);
          if (!cldFile.result || cldFile.result !== "ok") {
            throw new Error("Failed to delete file from Cloudinary");
          }
          await file.deleteOne(); // Delete file from database
        } catch (error) {
          throw error; // Propagate the error to the catch block below
        }
      })
    );
    return sendSuccessResponse(res, "Files deleted successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const renameFile = async (req, res) => {
  const { fileId, fileName } = req.body;
  try {
    const file = await File.findByIdAndUpdate(
      fileId,
      {
        $set: { fileName: fileName },
      },
      {
        new: true,
      }
    );
    if (!file) {
      throw new Error("File not found");
    }

    return sendSuccessResponse(res, "File renamed successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const moveFiles = async (req, res) => {
  const { filesInfo } = req.body;
  if (!filesInfo || !Array.isArray(filesInfo) || filesInfo.length === 0) {
    throw new Error("File fields are required");
  }
  try {
    await Promise.all(
      filesInfo.map(async (fileInfo) => {
        try {
          const file = await File.findByIdAndUpdate(
            fileInfo.fileId,
            {
              $set: { folderId: fileInfo.newFolderId },
            },
            {
              new: true,
            }
          );

          if (!file) {
            throw new Error("File not found");
          }
        } catch (error) {
          throw error; // Propagate the error to the catch block below
        }
      })
    );
    return sendSuccessResponse(res, "Files moved successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

export { createFiles, getFiles, deleteFiles, renameFile, moveFiles };
