import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "3mb" })); //to response and get data in json format
app.use(express.urlencoded({ extended: true, limit: "15kb" })); //use for converting special characters such as % into original characters
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import folderRouter from "./routes/folder.route.js";
import verifyJWT from "./middlewares/auth.middleware.js";
import fileRouter from "./routes/file.route.js";
import shareRouter from "./routes/share.route.js";
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/folder", verifyJWT, folderRouter);
app.use("/api/v1/file", verifyJWT, fileRouter);
app.use ("/api/v1/share", verifyJWT, shareRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

export default app;
