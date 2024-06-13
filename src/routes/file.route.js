import { Router } from "express";
import { createFiles, deleteFiles, getFiles, moveFiles, renameFile } from "../controllers/file.controller.js";
import upload from "../middlewares/multer.middleware.js";

const fileRouter = Router();

fileRouter.route("/create-files").post(
  upload.fields([
    { name: "files", maxCount: 10 }, // Adjust field name and maxCount as needed
  ]),
  createFiles
);

fileRouter.route("/get-files").post(getFiles);
fileRouter.route("/delete-files").post(deleteFiles);
fileRouter.route("/rename-file").post(renameFile);
fileRouter.route("/move-files").post( moveFiles);

export default fileRouter;
