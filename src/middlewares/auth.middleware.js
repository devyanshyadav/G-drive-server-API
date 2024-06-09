import User from "../models/user.model.js";
import sendErrorResponse from "../utils/sendErrorResponse.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    // Get the token from the cookies or the Authorization header
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("Unauthorized: Token Missing");
      return sendErrorResponse(res, "Unauthorized: Token Missing", 401);
    }
    // Verify the token using the JWT_ACCESS_SECRET
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // Find the user by ID from the payload
    const user = await User.findById(payload.id);
    if (!user) {
      console.log("Unauthorized: User not found");
      return sendErrorResponse(res, "Unauthorized: User not found", 401);
    }
    // Attach the user object to the request object
    req.user = user;
    next();
  } catch (error) {
    // console.error("JWT verification error:", error);
    if (error.name === "TokenExpiredError") {
      try {
        // Call the refreshTokenInstance function and handle the response
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
          return sendErrorResponse(res, "Unauthorized: Token Missing", 401);
        }

        const verifyRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        if (!verifyRefreshToken) {
          return sendErrorResponse(
            res,
            "Unauthorized: Refresh Token Missing Try Login or Signup",
            401
          );
        }

        const userVerify = await User.findById(verifyRefreshToken.id);
        if (!userVerify) {
          return sendErrorResponse(res, "Unauthorized: User not found", 401);
        }

        if (userVerify.refreshToken !== refreshToken) {
          return sendErrorResponse(
            res,
            "Unauthorized: Try Login or Signup",
            401
          );
        }

        const newAccessToken = userVerify.generateAccessToken();

        // Set new access token in cookies
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
        });
        // Verify the new access token and continue with the request
        const payload = jwt.verify(
          newAccessToken,
          process.env.JWT_ACCESS_SECRET
        );
        const user = await User.findById(payload.id);
        if (!user) {
          return sendErrorResponse(res, "Unauthorized: User not found", 401);
        }
        req.user = user;
        next();
      } catch (refreshError) {
        return sendErrorResponse(
          res,
          "Unauthorized: Refresh Token Expired",
          401
        );
      }
    } else if (error.name === "JsonWebTokenError") {
      return sendErrorResponse(res, "Unauthorized: Invalid Token", 401);
    } else {
      return sendErrorResponse(res, "Internal Server Error", 500);
    }
  }
};

export default verifyJWT;
