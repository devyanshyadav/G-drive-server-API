import User from "../models/user.model.js";
import generateMailLink from "../utils/generateMailLink.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import sendSuccessResponse from "../utils/sendSuccessResponse.js";

// Function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
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

// Function to register a new user
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

    const user = await User.create({
      userName,
      email,
      password,
    });
    return sendSuccessResponse(res, "User created successfully", 201, user);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to login a user
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

// Function to logout a user
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

// Function to get current user
const getCurrentUser = async (req, res) => {
  try {
    return sendSuccessResponse(res, "User fetched successfully", 200, req.user);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to forget user password and send mail
const forgetUserPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendErrorResponse(res, "Email is required", 400);
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const result = await generateMailLink(user, "reset");
    if (!result) throw new Error("Something went wrong while sending mail");

    return sendSuccessResponse(res, "Mail sent successfully", 200);
    // Here otherwise send mail to user
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Function to reset user password
const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.query;

  if (!password || !confirmPassword || !id || !token)
    return sendErrorResponse(res, "All fields are required", 400);

  if (password !== confirmPassword)
    return sendErrorResponse(res, "Passwords do not match", 400);

  try {
    const user = await User.findOne({
      _id: id,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // 1 hour
    });

    if (!user) {
      return sendErrorResponse(res, "Invalid or expired token", 400);
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return sendSuccessResponse(res, "Password reset successfully", 200);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return sendErrorResponse(res, error.message, 400);
    }
    return sendErrorResponse(
      res,
      "An error occurred while resetting the password",
      500
    );
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
