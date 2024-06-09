import uploadFile from "../utils/cloudinary.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const createFiles = async (req, res) => {
  const { folderId } = req.body;
  if (!folderId) return sendErrorResponse(res, "All fields are required", 400);
  try {
    if (!req.files) {
      return sendErrorResponse(res, "File not found", 400);
    }

    const files = req.files["files"];
    const upload= await uploadFile(files)

    console.log(upload);

    return sendSuccessResponse(res, "File uploaded Successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

export { createFiles };
