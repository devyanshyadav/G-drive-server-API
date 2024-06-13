import crypto from "crypto";
import sendMail from "./nodemailer.js";
import User from "../models/user.model.js";

const generateMailLink = async (requestedUser, task) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const user = await User.findByIdAndUpdate(
      requestedUser._id,
      {
        $set: {
          resetToken: token,
          resetTokenExpires: Date.now() + 3600000, // 1 hour expiration
        },
      },
      { new: true }
    );

    const generatedLink =
      task === "reset"
        ? `${process.env.CLIENT_URL}/reset-password?id=${user._id}&token=${token}`
        : null;

    const res = await sendMail(user.email, generatedLink, task, user.userName);

    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default generateMailLink;