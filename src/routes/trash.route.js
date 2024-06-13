import { Router } from "express";
import { deleteTrashedItems, moveToTrash, restoreTrashedItems, trashedItems } from "../controllers/trash.controller.js";

const trashRouter = Router();

trashRouter.route("/move-to-trash").post(moveToTrash);
trashRouter.route("/get-trashed-items").get(trashedItems);
trashRouter.route("/delete-trashed-items").post(deleteTrashedItems)
trashRouter.route("/restore-trashed-items").post(restoreTrashedItems);

export default trashRouter;