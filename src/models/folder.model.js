import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    folderName: {
      type: String,
      required: true,
    },
    subFolders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
