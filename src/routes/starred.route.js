import { Router } from "express";
import {
  addToStarred,
  removeStarredItems,
  starredItems,
} from "../controllers/starred.controller.js";

const starredRouter = Router();

starredRouter.route("/add-to-starred").post(addToStarred);
starredRouter.route("/get-starred-items").get(starredItems);
starredRouter.route("/remove-starred-items").post(removeStarredItems);

export default starredRouter;
