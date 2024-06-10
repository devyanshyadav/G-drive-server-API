import Share from "../models/share.model.js";
import User from "../models/user.model.js"; // Assuming you have a User model
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const itemTypes = {
  FILE: "file",
  FOLDER: "folder",
};

const shareItem = async (req, res) => {
  const { sharedEmails, sharedItems, itemType } = req.body;
  if (!sharedEmails || !sharedItems || !itemType) {
    return sendErrorResponse(res, "All fields are required", 400);
  }

  // Check if the itemType is valid
  const validItemTypes = Object.values(itemTypes);
  if (!validItemTypes.includes(itemType)) {
    return sendErrorResponse(res, "Invalid item type", 400);
  }

  try {
    // Fetch user IDs based on sharedEmails
    const users = await User.find({ email: { $in: sharedEmails } }).select(
      "_id"
    );
    const userIds = users.map((user) => user._id);

    if (userIds.length !== sharedEmails.length) {
      return sendErrorResponse(
        res,
        "Some emails do not correspond to valid users",
        400
      );
    }

    const share = await Share.create({
      owner: req.user._id,
      sharedEmails: userIds,
      sharedType: itemType,
      sharedItems: sharedItems,
    });

    if (!share) {
      return sendErrorResponse(res, "Failed to create share", 400);
    }

    return sendSuccessResponse(res, "Share created successfully", 201, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const getSharedItemsByMe = async (req, res) => {
  try {
    const share = await Share.find({ owner: req.user._id })
      .populate("sharedEmails")
      .populate("sharedItems");

    if (!share) return sendErrorResponse(res, "Share not found", 404);

    return sendSuccessResponse(res, "Share found successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const getSharedItemsWithMe = async (req, res) => {
  try {
    const share = await Share.find({
      sharedEmails: { $in: [req.user._id] },
    }).populate("sharedItems");

    if (!share) return sendErrorResponse(res, "Share not found", 404);
    return sendSuccessResponse(res, "Share found successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const updateSharedItem = async (req, res) => {
  const { sharedItemId, updatedSharedItems } = req.body;
  if (!sharedItemId)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    const share = await Share.findByIdAndUpdate(
      sharedItemId,
      { $pull: { sharedItems: updatedSharedItems } },
      { new: true, runValidators: true }
    );
    if (!share) {
      return sendErrorResponse(res, "Share not found", 404);
    }
    return sendSuccessResponse(res, "Share updated successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const removeSharedItem = async (req, res) => {
  const { sharedItemId } = req.body;
  if (!sharedItemId)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    const share = await Share.findByIdAndDelete(sharedItemId);
    if (!share) {
      return sendErrorResponse(res, "Share not found", 404);
    }
    return sendSuccessResponse(res, "Share deleted successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

export {
  shareItem,
  getSharedItemsByMe,
  getSharedItemsWithMe,
  updateSharedItem,
  removeSharedItem,
};
