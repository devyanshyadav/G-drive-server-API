import { Router } from "express";
import validate from "../middlewares/validator.middleware.js";
import {
  forgetUserPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/user.controllers.js";
import registerSchema from "../validators/auth.validator.js";
import upload from "../middlewares/multer.middleware.js";
import refreshTokenInstance from "../controllers/refreshToken.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(validate(registerSchema), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/getuser").get(verifyJWT, getCurrentUser);
userRouter.route("/forget").post(forgetUserPassword);
userRouter.route("/reset").post(resetPassword);
// userRouter.route("/refresh-token").post(refreshTokenInstance);

export default userRouter;
