import { Router } from "express";
import {
  createFolder,
  getFolders,
  moveFolder,
  renameFolder,
} from "../controllers/folder.controller.js";

const folderRouter = Router();

folderRouter.route("/create-folder").post(createFolder);
folderRouter.route("/get-folders").get(getFolders);
folderRouter.route("/rename-folder").post(renameFolder);
folderRouter.route("/move-folder").post(moveFolder);

export default folderRouter;
