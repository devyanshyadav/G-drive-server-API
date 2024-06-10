import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const addToStarred = async (req, res) => {
  const { itemId, itemType } = req.body;

  if (!itemId || !itemType) {
    return sendErrorResponse(res, "All fields are required", 400);
  }

  try {
    let starredItem;

    if (itemType === "file") {
      starredItem = await File.findOneAndUpdate(
        { _id: itemId, owner: req.user._id },
        {
          $set: {
            isStarred: {
              status: true,
            },
          },
        },
        { new: true }
      );
    } else if (itemType === "folder") {
      starredItem = await Folder.findOneAndUpdate(
        { _id: itemId, owner: req.user._id },
        {
          $set: {
            isStarred: {
              status: true,
            },
          },
        },
        { new: true }
      );
    } else {
      throw new Error("Invalid item type");
    }

    if (!starredItem) {
      throw new Error(`${itemType} not found`);
    }

    return sendSuccessResponse(
      res,
      `${itemType} added to Starred`,
      200,
      starredItem
    );
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const starredItems = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user._id,
      "isStarred.status": true,
    });

    const folders = await Folder.find({
      owner: req.user._id,
      "isStarred.status": true,
    });

    if (files.length === 0 && folders.length === 0) {
      throw new Error("No items found");
    }

    const allItems = { starredFiles: files, starredFolders: folders };

    return sendSuccessResponse(res, "Items found successfully", 200, allItems);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const removeStarredItems = async (req, res) => {
  const { starredItems } = req.body;

  if (
    !starredItems ||
    typeof starredItems !== "object" ||
    !starredItems.starredFiles ||
    !starredItems.starredFolders
  ) {
    return sendErrorResponse(res, "Invalid starredItems format", 400);
  }

  try {
    if (starredItems.starredFiles.length > 0) {
      const removedStarredFiles = await File.updateMany(
        { _id: { $in: starredItems.starredFiles }, owner: req.user._id },
        { $set: { "isStarred.status": false } }
      );
      if (!removedStarredFiles || removedStarredFiles.nModified === 0) {
        throw new Error("Files not found or not owned by user");
      }
    }

    if (starredItems.starredFolders.length > 0) {
      const removedStarredFolders = await Folder.updateMany(
        { _id: { $in: starredItems.starredFolders }, owner: req.user._id },
        { $set: { "isStarred.status": false } }
      );
      if (!removedStarredFolders || removedStarredFolders.nModified === 0) {
        throw new Error("Folders not found or not owned by user");
      }
    }

    return sendSuccessResponse(res, "Items unstarred successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

export { addToStarred, starredItems, removeStarredItems };
