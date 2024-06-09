import Folder from "../models/folder.model.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const createFolder = async (req, res) => {
  const { folderName, parentFolder } = req.body;
  if (!folderName)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    const folder = await Folder.create({
      folderName,
      parentFolder,
      owner: req.user._id,
    });

    if (!folder) return sendErrorResponse(res, "Folder not created", 400);
    return sendSuccessResponse(res, "Folder created successfully", 201, folder);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const getFolders = async (req, res) => {
  try {
    const folders = await Folder.aggregate([
      { $match: { owner: req.user._id } },
      {
        $lookup: {
          from: "folders",
          localField: "_id",
          foreignField: "parentFolder",
          as: "subFolders",
        },
      },
      {
        $lookup: {
          from: "folders",
          localField: "parentFolder",
          foreignField: "_id",
          as: "parentFolder",
        },
      },
      // {
      //   $unwind: {
      //     path: "$parentFolderDetails",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     folderName: 1,
      //     subFolders: 1,
      //   },
      // }
    ]);

    if (!folders.length)
      return sendErrorResponse(res, "Folders not found", 400);
    return sendSuccessResponse(
      res,
      "Folders fetched successfully",
      200,
      folders
    );
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const renameFolder = async (req, res) => {
  const { folderId, folderName } = req.body;

  if (!folderId || !folderName) {
    return sendErrorResponse(res, "All fields are required", 400);
  }

  try {
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { $set: { folderName } },
      { new: true, runValidators: true }
    );

    if (!folder) {
      return sendErrorResponse(res, "Folder not found", 404);
    }

    return sendSuccessResponse(res, "Folder renamed successfully", 200, folder);
  } catch (error) {
    return sendErrorResponse(res, error.message, 500);
  }
};

const moveFolder = async (req, res) => {
  const { folderId, parentFolderId } = req.body;

  if (!folderId || !parentFolderId) {
    return sendErrorResponse(res, "All fields are required", 400);
  }
  try {
    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { $set: { parentFolder: parentFolderId } },
      { new: true, runValidators: true }
    );
    if (!folder) {
      return sendErrorResponse(res, "Folder not found", 404);
    }

    return sendSuccessResponse(res, "Folder moved successfully", 200, folder);
  } catch (error) {
    return sendErrorResponse(res, error.message, 500);
  }
};

const deleteFolder = async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) return sendErrorResponse(res, "All fields are required", 400);
  try {
    const folder = await Folder.findByIdAndDelete(folderId);

    if (!folder) return sendErrorResponse(res, "Folder not found", 404);

    return sendSuccessResponse(res, "Folder deleted successfully", 200, folder);
  } catch (error) {
    return sendErrorResponse(res, error.message, 500);
  }
};

export { createFolder, getFolders, renameFolder, moveFolder, deleteFolder };
