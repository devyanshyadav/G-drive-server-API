import { Router } from "express";
import { getSharedItemsByMe, getSharedItemsWithMe, shareItem, updateSharedItem } from "../controllers/share.controller.js";

const shareRouter = Router();

shareRouter.route("/share-item").post(shareItem);
shareRouter.route("/get-shared-items-by-me").get(getSharedItemsByMe);
shareRouter.route("/get-shared-items-with-me").get(getSharedItemsWithMe);
shareRouter.route("/update-shared-by-me").post(updateSharedItem);

export default shareRouter