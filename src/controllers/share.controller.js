import Share from "../models/share.model.js";
import User from "../models/user.model.js"; // Assuming you have a User model
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const itemTypes = {
  FILE: "file",
  FOLDER: "folder",
};

// Function to share an item
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
      throw new Error("Some emails do not correspond to valid users");
    }

    const share = await Share.create({
      owner: req.user._id,
      sharedEmails: userIds,
      sharedType: itemType,
      sharedItems: sharedItems,
    });

    if (!share) {
      throw new Error("Failed to create share");
    }

    return sendSuccessResponse(res, "Share created successfully", 201, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to get shared items to user
const getSharedItemsByMe = async (req, res) => {
  try {
    const share = await Share.find({ owner: req.user._id })
      .populate("sharedEmails")
      .populate("sharedItems");

    if (!share.length) throw new Error("Share not found");

    return sendSuccessResponse(res, "Share found successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to get shared items from user
const getSharedItemsWithMe = async (req, res) => {
  try {
    const share = await Share.find({
      sharedEmails: { $in: [req.user._id] },
    }).populate("sharedItems");

    if (!share.length) throw new Error("Share not found");
    return sendSuccessResponse(res, "Share found successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to update shared items
const updateSharedItem = async (req, res) => {
  const { sharedItemId, updatedSharedEmails } = req.body;
  if (!sharedItemId || !updatedSharedEmails)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    // Fetch user IDs based on sharedEmails
    const users = await User.find({
      email: { $in: updatedSharedEmails },
    }).select("_id");
    const userIds = users.map((user) => user._id);

    const share = await Share.findByIdAndUpdate(
      { _id: sharedItemId, owner: req.user._id },
      { $set: { sharedEmails: userIds } },
      { new: true, runValidators: true }
    );
    if (!share) {
      throw new Error("Share not found");
    }
    return sendSuccessResponse(res, "Share updated successfully", 200, share);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to remove shared item
const removeSharedItem = async (req, res) => {
  const { sharedItemId } = req.body;
  if (!sharedItemId)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    const share = await Share.findOneAndDelete({
      _id: sharedItemId,
      owner: req.user._id,
    });
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
