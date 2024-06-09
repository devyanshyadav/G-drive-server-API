import User from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";
import generateMailLink from "../utils/generateMailLink.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return sendErrorResponse(
      res,
      ("Something went wrong while generating tokens", error),
      400
    );
  }
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return sendErrorResponse(res, "All fields are required", 400);
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return sendErrorResponse(res, "User already exists", 400);
    }

    let avatar = "";

    if (req.file) {
      const avatarLocalPath = req.file.path;
      avatar = await uploadFile(avatarLocalPath);
      if (!avatar) {
        return sendErrorResponse(res, "Error while uploading", 400);
      }
    }

    const user = await User.create({
      userName,
      email,
      password,
      avatar: avatar.url || "",
    });
    return sendSuccessResponse(res, "User created successfully", 201, user);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return sendErrorResponse(res, "All fields are required", 400);
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) return sendErrorResponse(res, "User not found", 400);
    const isPasswordValid = await checkUser.isPasswordCorrect(password);

    if (!isPasswordValid)
      return sendErrorResponse(res, "Invalid credentials", 400);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      checkUser._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        payload: {
          userData: checkUser,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: null },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return sendSuccessResponse(res, "User fetched successfully", 200, req.user);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const forgetUserPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendErrorResponse(res, "Email is required", 400);
  try {
    const user = await User.findOne({ email });
    if (!user) return sendErrorResponse(res, "User not found", 400);

    const result = await generateMailLink(user, "reset");
    if (!result)
      return sendErrorResponse(res, "Error while sending mail: Try again", 400);

    return sendSuccessResponse(res, "Mail sent successfully", 200);
    // Here otherwise send mail to user
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.query;

  if (!password || !confirmPassword || !id || !token)
    return sendErrorResponse(res, "All fields are required", 400);

  if (password !== confirmPassword)
    return sendErrorResponse(res, "Passwords do not match", 400);

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
      },
      {
        password: password,
        resetToken: undefined,
        resetTokenExpires: undefined,
      },
      { new: true, runValidators: true }
    );
    if (!user) return sendErrorResponse(res, "Invalid or expired token", 400);

    await user.save();

    return sendSuccessResponse(res, "Password reset successfully", 200);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, error.message, 500);
  }
};

export default resetPassword;

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgetUserPassword,
  resetPassword,
};
