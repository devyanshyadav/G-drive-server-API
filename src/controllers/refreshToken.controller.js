//Not in Use

import jwt from "jsonwebtoken";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import User from "../models/user.model.js";

const refreshTokenInstance = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return sendErrorResponse(res, "Unauthorized User: Token Missing", 400);
    }

    const verifyToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    const user = await User.findById(verifyToken.id);

    if (!user) {
      return sendErrorResponse(res, "Unauthorized User: User Not Found", 400);
    }

    if (user.refreshToken !== refreshToken) {
      return sendErrorResponse(res, "Unauthorized User: Try Login or Signup", 400);
    }

    const newAccessToken = user.generateAccessToken();
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .json({ payload: { accessToken: newAccessToken } });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendErrorResponse(res, "Invalid Refresh Token", 401);
    }
    if (error.name === "TokenExpiredError") {
      return sendErrorResponse(res, "Refresh Token Expired", 401);
    }
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};

export default refreshTokenInstance;
