import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const itemTypes = {
  FILE: "file",
  FOLDER: "folder",
};

const moveToTrash = async (req, res) => {
  const { itemIds, itemType } = req.body;

  if (!itemIds || !itemType) {
    return sendErrorResponse(res, "All fields are required", 400);
  }

  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    return sendErrorResponse(res, "itemIds must be a non-empty array", 400);
  }

  const validItemTypes = Object.values(itemTypes);
  if (!validItemTypes.includes(itemType)) {
    return sendErrorResponse(res, "Invalid item type", 400);
  }

  try {
    let updatedItems = [];
    if (itemType === itemTypes.FILE) {
      updatedItems = await Promise.all(
        itemIds.map(async (itemId) => {
          const file = await File.findByIdAndUpdate(
            itemId,
            {
              $set: {
                isTrashed: {
                  status: true,
                  date: Date.now(),
                },
              },
            },
            { new: true }
          );

          if (!file) {
            throw new Error("File not found");
          }

          return file;
        })
      );
    } else if (itemType === itemTypes.FOLDER) {
      updatedItems = await Promise.all(
        itemIds.map(async (itemId) => {
          const folder = await Folder.findByIdAndUpdate(
            itemId,
            {
              $set: {
                isTrashed: {
                  status: true,
                  date: Date.now(),
                },
              },
            },
            { new: true }
          );

          if (!folder) {
            throw new Error("Folder not found");
          }

          return folder;
        })
      );
    }

    return sendSuccessResponse(
      res,
      `${itemType}s moved to trash`,
      200,
      updatedItems
    );
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const trashedItems = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user._id,
      "isTrashed.status": true,
    });

    const folders = await Folder.find({
      owner: req.user._id,
      "isTrashed.status": true,
    });

    // If both trashedFiles and trashedFolders are empty, throw an error
    if (files.length === 0 && folders.length === 0) {
      throw new Error("No items found");
    }

    const allItems = { trashedFiles: [...files], trashedFolders: [...folders] };

    return sendSuccessResponse(res, "Items found successfully", 200, allItems);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const deleteTrashedItems = async (req, res) => {
  const { trashedItems } = req.body;
  //Here trashed Items will be an object with trashedFiles and trashedFolders
  if (
    !trashedItems ||
    typeof trashedItems !== "object" ||
    !trashedItems.trashedFiles ||
    !trashedItems.trashedFolders
  ) {
    return sendErrorResponse(res, "Invalid trashedItems format", 400);
  }

  try {
    if (trashedItems.trashedFiles.length > 0) {
      const filesDeleted = await File.deleteMany({
        _id: { $in: trashedItems.trashedFiles },
      });
      if (!filesDeleted) {
        throw new Error("Files not found");
      }
    }

    if (trashedItems.trashedFolders.length > 0) {
      const foldersDeleted = await Folder.deleteMany({
        _id: { $in: trashedItems.trashedFolders },
      });
      if (!foldersDeleted) {
        throw new Error("Folders not found");
      }
    }

    return sendSuccessResponse(res, "Items deleted successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

export { moveToTrash, trashedItems, deleteTrashedItems };
