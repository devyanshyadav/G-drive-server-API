import { Router } from "express";
import { createFiles } from "../controllers/file.controller.js";
import upload from "../middlewares/multer.middleware.js";

const fileRouter = Router();

fileRouter.route("/create-files").post(
  upload.fields([
    { name: "files", maxCount: 10 }, // Adjust field name and maxCount as needed
  ]),
  createFiles
);

export default fileRouter;
