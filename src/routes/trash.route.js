import { Router } from "express";
import { deleteTrashedItems, moveToTrash, trashedItems } from "../controllers/trash.controller.js";

const trashRouter = Router();

trashRouter.route("/get-trashed-items").get(trashedItems);
trashRouter.route("/move-to-trash").post(moveToTrash);
trashRouter.route("/delete-trashed-items").post(deleteTrashedItems)

export default trashRouter;